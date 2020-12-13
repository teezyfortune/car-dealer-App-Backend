const serverErrorResponse = (res, message) => res.status(500).json({ message });
const successOkResponse = (res, message) => res.status(200).json({ message });

export { serverErrorResponse, successOkResponse };
