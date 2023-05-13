import { useCallback, useEffect, useRef } from 'react';
import { useStateWithCallBack } from './useStateWithCallback';
import socketInit from '../socket'
import { ACTIONS } from '../socket-actions/actions';
import freeice from 'freeice';


export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallBack([]); // With useStateWithCallBack hook now we'll be able to update the state 'client' using
    // setClient but also we'll be able to execute a callback after setting the state and 
    // that callback we'll pass as second argument 


    // e.g
    // We'll be able to use the hook useStae with callBack as below now to update the state
    // setClients((prev)=> {

    // }, 
    // // So we can see that, now we are passing an additional callback function inside setState function
    // (state)=>{
    //     // we can perform anything now inside this callback after the state has updated (note: we are recieving the updated state as parameter here)

    // })


    const audioElements = useRef({}); // to maintain the mapping of audioElements of each user (speaker) e.g. { userId: audioElementInstance}
    const connections = useRef({}); // to store all the peer connections e.g. { socketId: connectionInstance}
    const localMediaStream = useRef(null) // to store the media stream of this client
    const socket = useRef(null);
    const clientsRef = useRef([]) // keeping this reference to clients for use in mute/unmute useEffect

    useEffect(() => {
        socket.current = socketInit();
    }, [])

    const addNewClient = useCallback((newClient, cb) => {
        const lookingFor = clients.find((client) => {
            return client.id === newClient.id;
        })

        // if the client does not already exists
        if (lookingFor === undefined) {
            setClients((prevClients) => {
                return [...prevClients, newClient];
            },
                // second arg callback
                cb
            )
        }
    }, [clients, setClients])

    // Capture media
    useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
        };

        startCapture().then(() => {
            // after the audio has been captured, store the current user in clients state
            addNewClient({...user, muted: true }, () => {
                const localAudioElement = audioElements.current[user.id];
                if (localAudioElement) {
                    localAudioElement.volume = 0; // so that the local user does not listen to his own audio
                    localAudioElement.srcObject = localMediaStream.current;
                }

                // socket emit JOIN socket io
                console.log('Calling for join event')
                socket.current.emit(ACTIONS.JOIN, { roomId, user })
            })
        })

        return ()=>{
            // Leaving the room
            localMediaStream.current.getTracks().forEach(track => track.stop());

            socket.current.emit(ACTIONS.LEAVE, { roomId })
        }
        // eslint-disable-next-line
    }, [])

    // handle new peer
    useEffect(() => {
        const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
            if (peerId in connections.current) {
                // if already connected then give warning
                return console.warn(`You are already connected with ${peerId} ${user.name}`)
            }

            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice()
            })

            // handle new iceCandidate
            connections.current[peerId].onicecandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate
                })
            }

            // handle on track on this connection
            connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
                addNewClient({...remoteUser, muted: true}, () => {
                    // Once the new client is added
                    // check if some audioElement related to this client is available or not
                    if (audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject = remoteStream;
                    }
                    else {
                        // If audio element for the client is not available -> Check every one sec until the audio element for the client becomes available
                        let settled = false;
                        const interval = setInterval(() => {
                            if (audioElements.current[remoteUser.id]) {
                                audioElements.current[remoteUser.id].srcObject = remoteStream;

                                settled = true;
                            }
                            if (settled) {
                                clearInterval(interval)
                            }
                        }, 1000);
                    }
                })
            }

            // Add local track to remote connections
            localMediaStream.current.getTracks().forEach((track) => {
                connections.current[peerId].addTrack(track, localMediaStream.current)
            })

            // create offer
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer()

                await connections.current[peerId].setLocalDescription(offer)

                // send offer to another client
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer
                })
            }
        }
        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)

        // cleanup function
        return () => {
            socket.current.off(ACTIONS.ADD_PEER)
        }
        // eslint-disable-next-line
    }, [])

    // Handle icecandidate
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        })

        // cleanup function
        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE)
        }
        // eslint-disable-next-line
    }, [])

    // Handle session description
    useEffect(() => {

        const handleRemoteSDP = async ({ peerId, sessionDescription: remoteSessionDescription }) => {
            connections.current[peerId].setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));

            // if session description is 'offer' type then create an answer
            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];
                const answer = await connection.createAnswer();

                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                })
            }
        }

        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP)

        // cleanup function
        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION)
        }
        // eslint-disable-next-line
    }, [])

    // handle remove peer
    useEffect(()=>{

        const handleRemovePeer = async ({ peerId, userId })=>{
            if(connections.current[peerId])
            {
                connections.current[peerId].close()
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients((clientsList)=>{
                return clientsList.filter((client)=>{
                    return client.id !== userId;
                })
            })
        }

        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        // cleanup function
        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER)
        }
        // eslint-disable-next-line
    }, [])

    useEffect(()=>{
        clientsRef.current = clients;
    }, [clients])

    // Listen for mute/ unmute
    useEffect(()=>{
        const setMute = (mute, userId)=>{
            const clientIdx = clientsRef.current.map(client => client.id).indexOf(userId)
            // console.log("idx", clientIdx) //
            
            const connectedClients = JSON.parse(JSON.stringify(clientsRef.current)); // createing a copy of clientsRef.current

            // if the clientIndex is present in the clients list
            if(clientIdx > -1) {
                connectedClients[clientIdx].muted = mute;
                setClients(connectedClients);
            }
        }
        // mute
        socket.current.on(ACTIONS.MUTE, ({ peerId, userId })=>{
            setMute(true, userId);
        })
        // unmute
        socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId })=>{
            setMute(false, userId);
        })
    }, [])

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    }

    const handleMute= (isMute, userId)=>{
        let settled = false;
        let interval = setInterval(()=>{
            if(localMediaStream.current)
            {
                localMediaStream.current.getTracks()[0].enabled = !isMute; // this(.enabled) will send empty frame if false (means mute)
                if(isMute){
                    // send the mute update to other connected clients
                    // we'll send this using web socket
                    socket.current.emit(ACTIONS.MUTE, { roomId, userId, })
                }
                else{
                    socket.current.emit(ACTIONS.UNMUTE, { roomId, userId, })
                }

                settled = true;
            }
            if(settled){
                clearInterval(interval);
            }
        }, 200)
    }

    return { clients, provideRef, handleMute };
}