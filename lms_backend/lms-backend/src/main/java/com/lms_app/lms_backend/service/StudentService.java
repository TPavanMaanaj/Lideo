package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.*;
import java.util.List;

public interface StudentService {
	StudentDTO createStudent(StudentDTO studentDTO);
    StudentDTO getStudentById(Long id);
    List<StudentDTO> getAllStudents();
    StudentDTO updateStudent(Long id, StudentDTO studentDTO);
    void deleteStudent(Long id);
}
