package com.project.myapp.controllers;

import com.project.myapp.components.LocalizationUtils;
import com.project.myapp.dtos.CategoryDTO;
import com.project.myapp.models.Category;
import com.project.myapp.responses.CategoryResponse;
import com.project.myapp.servers.ICategoryService;
import com.project.myapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final ICategoryService categoryService;
    private final LocalizationUtils localizationUtils;

    @PostMapping("")
    //Nếu tham số truyền vào là 1 object thì sao ? => Data Transfer Object = Request Object
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryDTO categoryDTO,
            BindingResult result) {
        CategoryResponse categoryResponse = new CategoryResponse();
        
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            categoryResponse.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.INSERT_CATEGORY_FAILED));
            categoryResponse.setErrors(errorMessages);
            return ResponseEntity.badRequest().body(categoryResponse);
        }
        Category category = categoryService.createCategory(categoryDTO);
        categoryResponse.setCategory(category);
        categoryResponse.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.INSERT_CATEGORY_SUCCESSFULLY));
        return ResponseEntity.ok(categoryResponse);
    }

    @GetMapping("")
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "limit") int limit,
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("name").ascending());
        List<Category> categories = categoryService.getAllCategories(keyword, pageable);
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO
            , BindingResult result
    ) {
        CategoryResponse updateCategoryResponse = new CategoryResponse();
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            updateCategoryResponse.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.UPDATE_CATEGORY_FAILED));
            updateCategoryResponse.setErrors(errorMessages);
            return ResponseEntity.badRequest().body(updateCategoryResponse);
        }
        Category category = categoryService.updateCategory(id, categoryDTO);
        updateCategoryResponse.setCategory(category);
        updateCategoryResponse.setMessage(localizationUtils.getLocalizedMessage(MessageKeys.UPDATE_CATEGORY_SUCCESSFULLY));
        return ResponseEntity.ok(updateCategoryResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(localizationUtils.getLocalizedMessage(MessageKeys.DELETE_CATEGORY_SUCCESSFULLY));
    }
}
