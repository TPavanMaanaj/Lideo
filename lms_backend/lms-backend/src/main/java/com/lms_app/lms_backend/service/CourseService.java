package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.CourseDTO;
import java.util.List;

public interface CourseService {
    CourseDTO createCourse(CourseDTO dto);
    CourseDTO getCourseById(Long id);
    List<CourseDTO> getAllCourses();
    CourseDTO updateCourse(Long id, CourseDTO dto);
    void deleteCourse(Long id);
}
