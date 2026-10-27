import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
}) => {
  return (
    <div className="alert alert-danger d-flex align-items-center justify-content-between p-4 my-4 shadow-sm rounded-3">
      <div>
        <h5 className="alert-heading mb-1 fw-bold">{title}</h5>
        <p className="mb-0 text-secondary">{message}</p>
      </div>
      {onRetry && (
        <button className="btn btn-outline-danger ms-3 px-4" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};
