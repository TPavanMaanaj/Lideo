package com.lms_app.lms_backend.repository;

import com.lms_app.lms_backend.entity.Students;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Students, Long> {
    boolean existsByEmail(String email);
}