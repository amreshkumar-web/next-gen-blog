const sendResponse = (resp, status,message, data=null) => {
    if(data==null) return resp.status(status).json({ message: message});
    return resp.status(status).json({ message: message, data });
}

module.exports = sendResponse; 
