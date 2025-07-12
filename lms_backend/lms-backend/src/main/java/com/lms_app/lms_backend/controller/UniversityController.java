package com.lms_app.lms_backend.controller;

import com.lms_app.lms_backend.dto.UniversityDTO;
import com.lms_app.lms_backend.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universities")
@CrossOrigin(origins = "http://localhost:3000")
public class UniversityController {

    @Autowired
    private UniversityService universityService;

    @PostMapping
    public UniversityDTO createUniversity(@RequestBody UniversityDTO dto) {
        return universityService.createUniversity(dto);
    }

    @GetMapping("/{id}")
    public UniversityDTO getUniversity(@PathVariable Long id) {
        return universityService.getUniversityById(id);
    }

    @GetMapping
    public List<UniversityDTO> getAllUniversities() {
        return universityService.getAllUniversities();
    }

    @PutMapping("/{id}")
    public UniversityDTO updateUniversity(@PathVariable Long id, @RequestBody UniversityDTO dto) {
        return universityService.updateUniversity(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUniversity(@PathVariable Long id) {
        universityService.deleteUniversity(id);
    }
}
