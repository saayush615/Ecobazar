const asyncHandler = (fn, onError) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        if (typeof onError === 'function') onError(req, err);
        next(err);
    });
};

export default asyncHandler;