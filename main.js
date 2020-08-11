getElement = (id) => {
    return document.getElementById(id)
}

// Button [camera]
const btnOpenCamera = getElement('localOpenCamera');
// Button [Start video call]
const btnStartVideo = getElement('startVideoCall');
// Textbox [remoteId]
const inputRemoteId = getElement('remoteId');
// Label my id
const myId = getElement('myId');

const peer = new Peer();
peer.on('open', id => myId.append(id));

openCamera = () => {
    let config = {
        audio: flase,
        video: true
    }

    return navigator.mediaDevices.getUserMedia(config)
}

playVideo = (idVideoTag, stream) => {
    let video = getElement(idVideoTag);
    video.srcObject = stream;
    video.play();
}


// Click button [Open camera]
btnOpenCamera.addEventListener('click', () => {
    openCamera().then(stream => playVideo('localStream', stream));
});

// Click button [Start video call]
btnStartVideo.addEventListener('click', () => {
    const remoteId = inputRemoteId.value;
    openCamera().then(
        stream => {
            playVideo('localStream', stream);
            const call = peer.call(remoteId, stream);
            call.on('stream', remoteStream => playVideo('remoteStream', remoteStream));
        }
    );
});


// Người nhận cuộc gọi
peer.on('call', call => {
    openCamera().then(
        stream => {
            call.answer(stream);
            playVideo('localStream', stream); // khởi động video của người nhận
            call.on('stream', remoteStream => playVideo('remoteStream', remoteStream));
        }
    );
})