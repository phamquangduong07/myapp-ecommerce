package com.project.myapp.repositories;

import com.project.myapp.models.Token;
import com.project.myapp.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {
    List<Token> findByUser(User user);
    Token findByToken(String token);
    Token findByRefreshToken(String token);
    Optional<Token> findByRefreshTokenAndUserAndExpiredFalse(
            String refreshToken,
            User user
    );
}