package com.project.myapp.servers;

import com.project.myapp.dtos.UpdateUserDTO;
import com.project.myapp.dtos.UserDTO;
import com.project.myapp.exceptions.DataNotFoundException;
import com.project.myapp.models.User;

public interface IUserService {
    User createUser(UserDTO userDTO) throws DataNotFoundException, Exception;
    String login(String phoneNumber, String password
//            , Long roleId
    ) throws Exception;
    User getUserDetailsFromToken(String token) throws Exception;
    User updateUser(Long userId, UpdateUserDTO updatedUserDTO) throws Exception;
}
