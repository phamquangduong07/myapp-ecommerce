package com.project.myapp.servers.impl;

import com.project.myapp.dtos.CategoryDTO;
import com.project.myapp.models.Category;
import com.project.myapp.repositories.CategoryRepository;
import com.project.myapp.servers.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;
    @Override
    @Transactional
    public Category createCategory(CategoryDTO categoryDTO) {

        Category category = Category.builder()
                .name(categoryDTO.getName())
                .build();
        return categoryRepository.save(category);
    }

    @Override
    public Category getCategoryById(long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public List<Category> getAllCategories(String keyword, Pageable pageable) {
        return categoryRepository.findByNameContaining(keyword, pageable).getContent();
    }

    @Override
    @Transactional
    public Category updateCategory(long id, CategoryDTO categoryDTO) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(categoryDTO.getName());
        categoryRepository.save(existingCategory);
        return existingCategory;
    }

    @Override
    @Transactional
    public void deleteCategory(long id) {
        categoryRepository.deleteById(id);
    }
}
