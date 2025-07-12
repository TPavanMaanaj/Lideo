package com.lms_app.lms_backend.controller;

import com.lms_app.lms_backend.dto.AdminDTO;
import com.lms_app.lms_backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping
    public AdminDTO createAdmin(@RequestBody AdminDTO dto) {
        return adminService.createAdmin(dto);
    }

    @GetMapping("/{id}")
    public AdminDTO getAdmin(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    @GetMapping
    public List<AdminDTO> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PutMapping("/{id}")
    public AdminDTO updateAdmin(@PathVariable Long id, @RequestBody AdminDTO dto) {
        return adminService.updateAdmin(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
    }
}
