package com.lms_app.lms_backend;

import com.lms_app.lms_backend.dto.UniversityDTO;
import com.lms_app.lms_backend.entity.University;
import com.lms_app.lms_backend.exception.ResourceNotFoundException;
import com.lms_app.lms_backend.repository.UniversityRepository;
import com.lms_app.lms_backend.service.UniversityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UniversityServiceImpl implements UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    private UniversityDTO convertToDTO(University university) {
        UniversityDTO dto = new UniversityDTO();
        dto.setUniName(university.getUniName());
        dto.setEstYear(university.getEstYear());
        dto.setAddress(university.getAddress());
        dto.setStatus(university.getStatus().name());
        dto.setAdminName(university.getAdminName());
        dto.setStudents(university.getStudents());
        dto.setCourses(university.getCourses());
        return dto;
    }

    private University convertToEntity(UniversityDTO dto) {
        University university = new University();
        university.setUniName(dto.getUniName());
        university.setEstYear(dto.getEstYear());
        university.setAddress(dto.getAddress());
        university.setStatus(University.Status.valueOf(dto.getStatus().toUpperCase()));
        university.setAdminName(dto.getAdminName());
        university.setStudents(dto.getStudents());
        university.setCourses(dto.getCourses());
        return university;
    }

    @Override
    public UniversityDTO createUniversity(UniversityDTO dto) {
        University university = convertToEntity(dto);
        return convertToDTO(universityRepository.save(university));
    }

    @Override
    public UniversityDTO getUniversityById(Long id) {
        return convertToDTO(universityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found")));
    }

    @Override
    public List<UniversityDTO> getAllUniversities() {
        return universityRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UniversityDTO updateUniversity(Long id, UniversityDTO dto) {
        University existing = universityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        existing.setUniName(dto.getUniName());
        existing.setEstYear(dto.getEstYear());
        existing.setAddress(dto.getAddress());
        existing.setStatus(University.Status.valueOf(dto.getStatus().toUpperCase()));
        existing.setAdminName(dto.getAdminName());
        existing.setStudents(dto.getStudents());
        existing.setCourses(dto.getCourses());
        return convertToDTO(universityRepository.save(existing));
    }

    @Override
    public void deleteUniversity(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));
        universityRepository.delete(university);
    }
}