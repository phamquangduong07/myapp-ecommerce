package com.project.myapp.servers;

import com.project.myapp.models.Token;
import com.project.myapp.models.User;

import org.springframework.stereotype.Service;

@Service

public interface ITokenService {
    Token addToken(User user, String token, boolean isMobileDevice);
    Token refreshToken(String refreshToken, User user) throws Exception;
}
