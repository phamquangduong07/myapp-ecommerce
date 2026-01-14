package com.project.myapp.exceptions;

public class PermissionDenyException extends Exception{
    public PermissionDenyException(String message) {
        super(message);
    }
}
