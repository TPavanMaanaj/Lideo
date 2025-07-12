package com.lms_app.lms_backend;

import com.lms_app.lms_backend.dto.StudentDTO;
import com.lms_app.lms_backend.entity.Students;
import com.lms_app.lms_backend.entity.University;
import com.lms_app.lms_backend.exception.ResourceNotFoundException;
import com.lms_app.lms_backend.repository.StudentRepository;
import com.lms_app.lms_backend.repository.UniversityRepository;
import com.lms_app.lms_backend.service.StudentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UniversityRepository universityRepository;

    private StudentDTO convertToDTO(Students student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setEmail(student.getEmail());
        dto.setMajor(student.getMajor());
        dto.setYear(student.getYear());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setUniversityId(student.getUniversity().getId());
        return dto;
    }

    private Students convertToEntity(StudentDTO dto) {
        Students student = new Students();
        student.setStudentId(dto.getStudentId());
        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setMajor(dto.getMajor());
        student.setYear(dto.getYear());
        student.setPhoneNumber(dto.getPhoneNumber());
        University university = universityRepository.findById(dto.getUniversityId())
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        student.setUniversity(university);
        return student;
    }

    @Override
    public StudentDTO createStudent(StudentDTO dto) {
        Students student = convertToEntity(dto);
        return convertToDTO(studentRepository.save(student));
    }

    @Override
    public StudentDTO getStudentById(Long id) {
        return convertToDTO(studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found")));
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Students existing = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        existing.setFullName(dto.getFullName());
        existing.setEmail(dto.getEmail());
        existing.setMajor(dto.getMajor());
        existing.setYear(dto.getYear());
        existing.setPhoneNumber(dto.getPhoneNumber());
        return convertToDTO(studentRepository.save(existing));
    }

    @Override
    public void deleteStudent(Long id) {
        Students student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        studentRepository.delete(student);
    }
}