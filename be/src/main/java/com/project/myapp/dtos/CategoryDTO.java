package com.project.myapp.dtos;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDTO {
    @NotEmpty(message = "Category's name must not be empty")
    private String name;
}
