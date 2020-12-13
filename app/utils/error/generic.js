const notFoundError = (res, message) => res.status(404).json({ message });
const badRequest = (res, message) => res.status(400).json({ message });
const conflictError = (res, message) => res.status(409).json({ message });
const unauthorizeError = (res, message) => res.status(401).json({ message });
const serverError = (res, message) => res.status(500).json({ message });
const successResponse = (res, message, data) => res.status(200).json({ message, data });
const createdOkResponse = (res, message, data) => res.status(201).json({ message, data });

export default {
  notFoundError,
  badRequest,
  conflictError,
  unauthorizeError,
  serverError,
  successResponse,
  createdOkResponse
};
