package com.lms_app.lms_backend;

import com.lms_app.lms_backend.service.*;
import com.lms_app.lms_backend.dto.AdminDTO;
import com.lms_app.lms_backend.entity.Admin;
import com.lms_app.lms_backend.exception.ResourceNotFoundException;
import com.lms_app.lms_backend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    private AdminDTO convertToDTO(Admin admin) {
        AdminDTO dto = new AdminDTO();
        dto.setId(admin.getId());
        dto.setAdminName(admin.getAdminName());
        dto.setUniName(admin.getUniName());
        dto.setRole(admin.getRole());
        dto.setStatus(admin.getStatus().name());
        dto.setEmail(admin.getEmail());
        dto.setStudents(admin.getStudents());
        dto.setPhnnum(admin.getPhnnum());
        dto.setDepartment(admin.getDepartment());
        dto.setAdminStatus(admin.getAdminStatus().name());
        return dto;
    }

    private Admin convertToEntity(AdminDTO dto) {
        Admin admin = new Admin();
        admin.setAdminName(dto.getAdminName());
        admin.setUniName(dto.getUniName());
        admin.setRole(dto.getRole());
        admin.setStatus(Admin.Status.valueOf(dto.getStatus().toUpperCase()));
        admin.setEmail(dto.getEmail());
        admin.setStudents(dto.getStudents());
        admin.setPhnnum(dto.getPhnnum());
        admin.setDepartment(dto.getDepartment());
        admin.setAdminStatus(Admin.AdminStatus.valueOf(dto.getAdminStatus().toUpperCase()));
        return admin;
    }

    @Override
    public AdminDTO createAdmin(AdminDTO dto) {
        Admin admin = convertToEntity(dto);
        return convertToDTO(adminRepository.save(admin));
    }

    @Override
    public AdminDTO getAdminById(Long id) {
        return convertToDTO(adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found")));
    }

    @Override
    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdminDTO updateAdmin(Long id, AdminDTO dto) {
        Admin existing = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        existing.setAdminName(dto.getAdminName());
        existing.setUniName(dto.getUniName());
        existing.setRole(dto.getRole());
        existing.setStatus(Admin.Status.valueOf(dto.getStatus().toUpperCase()));
        existing.setEmail(dto.getEmail());
        existing.setStudents(dto.getStudents());
        existing.setPhnnum(dto.getPhnnum());
        existing.setDepartment(dto.getDepartment());
        existing.setAdminStatus(Admin.AdminStatus.valueOf(dto.getAdminStatus().toUpperCase()));
        return convertToDTO(adminRepository.save(existing));
    }

    @Override
    public void deleteAdmin(Long id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
        adminRepository.delete(admin);
    }
}