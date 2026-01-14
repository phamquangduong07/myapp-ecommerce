package com.project.myapp.servers.impl;

import com.project.myapp.models.Role;
import com.project.myapp.repositories.RoleRepository;
import com.project.myapp.servers.IRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final RoleRepository roleRepository;
    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
