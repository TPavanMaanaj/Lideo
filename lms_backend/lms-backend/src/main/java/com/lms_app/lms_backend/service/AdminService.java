package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.AdminDTO;
import java.util.List;

public interface AdminService {
    AdminDTO createAdmin(AdminDTO dto);
    AdminDTO getAdminById(Long id);
    List<AdminDTO> getAllAdmins();
    AdminDTO updateAdmin(Long id, AdminDTO dto);
    void deleteAdmin(Long id);
}