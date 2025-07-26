package com.neoping.backend.exception;

public class SpringRedditException extends RuntimeException {
    public SpringRedditException(String exMessage) {
        super(exMessage);
    }

    public SpringRedditException(String exMessage, Throwable cause) {
        super(exMessage, cause);
    }
}
