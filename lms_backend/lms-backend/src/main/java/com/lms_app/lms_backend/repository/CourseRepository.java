package com.lms_app.lms_backend.repository;

import com.lms_app.lms_backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {}
