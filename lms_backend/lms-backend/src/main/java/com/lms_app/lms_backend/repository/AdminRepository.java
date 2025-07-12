package com.lms_app.lms_backend.repository;

import com.lms_app.lms_backend.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {}

