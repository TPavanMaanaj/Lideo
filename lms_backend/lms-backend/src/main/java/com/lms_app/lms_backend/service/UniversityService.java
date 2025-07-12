package com.lms_app.lms_backend.service;

import com.lms_app.lms_backend.dto.UniversityDTO;
import java.util.List;

public interface UniversityService {
    UniversityDTO createUniversity(UniversityDTO dto);
    UniversityDTO getUniversityById(Long id);
    List<UniversityDTO> getAllUniversities();
    UniversityDTO updateUniversity(Long id, UniversityDTO dto);
    void deleteUniversity(Long id);
}
