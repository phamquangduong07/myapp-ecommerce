package com.project.myapp.servers;

import com.project.myapp.dtos.CategoryDTO;
import com.project.myapp.models.Category;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ICategoryService {
    Category createCategory(CategoryDTO categoryDTO);

    Category getCategoryById(long id);

    List<Category> getAllCategories(String keyword, Pageable pageable);

    Category updateCategory(long id, CategoryDTO categoryDTO);

    void deleteCategory(long id);


}
