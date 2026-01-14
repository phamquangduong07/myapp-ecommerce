package com.project.myapp.servers.impl;

import com.project.myapp.dtos.ProductDTO;
import com.project.myapp.dtos.ProductImageDTO;
import com.project.myapp.exceptions.DataNotFoundException;
import com.project.myapp.exceptions.InvalidParamException;
import com.project.myapp.models.Category;
import com.project.myapp.models.Product;
import com.project.myapp.models.ProductImage;
import com.project.myapp.repositories.CategoryRepository;
import com.project.myapp.repositories.ProductImageRepository;
import com.project.myapp.repositories.ProductRepository;
import com.project.myapp.responses.ProductResponse;
import com.project.myapp.servers.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    @Override
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException {
        Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new DataNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .thumbnail(productDTO.getThumbnail())
                .description(productDTO.getDescription())
                .category(existingCategory)
                .build();
        return productRepository.save(newProduct);
    }

    @Override
    public Product getProductById(long id) throws Exception {
        Optional<Product> optionalProduct = productRepository.getDetailProduct(id);
        if(optionalProduct.isPresent()){
            return optionalProduct.get();
        }
        throw  new DataNotFoundException("Product not found with id: " + id);

    }

    @Override
    public Page<ProductResponse> getAllProducts(String keyword, Long categoryId, PageRequest pageRequest) {
        Page<Product> productPage;
        productPage = productRepository.searchProducts(categoryId, keyword, pageRequest);

        return productPage.map(ProductResponse::fromProduct);
    }

    @Override
    @Transactional
    public Product updateProduct(long id, ProductDTO productDTO) throws Exception {
        Product existingProduct = getProductById(id);
        if(existingProduct!= null){
            Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new DataNotFoundException("Category not found with id: " + productDTO.getCategoryId()));
            existingProduct.setName(productDTO.getName());
            existingProduct.setPrice(productDTO.getPrice());
            existingProduct.setThumbnail(productDTO.getThumbnail());
            existingProduct.setDescription(productDTO.getDescription());
            existingProduct.setCategory(existingCategory);
            return productRepository.save(existingProduct);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteProduct(long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        optionalProduct.ifPresent(productRepository::delete);
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    @Override
    public ProductImage createProductImage(Long productId,
                                           ProductImageDTO productImageDTO) throws Exception {

        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productImageDTO.getProductId()));
        ProductImage newProductImage = ProductImage.builder()
                .imageUrl(productImageDTO.getImageUrl())
                .product(existingProduct)
                .build();
        //Ko cho insert quá 5 ảnh cho 1 sản phẩm
        int size = productImageRepository.findByProductId(productId).size();
        if(size >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT){
            throw new InvalidParamException("Number of images must be <= " + ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
        }
        return productImageRepository.save(newProductImage);
    }

    @Override
    public List<Product> findProductsByIds(List<Long> productIds) {
        return productRepository.findProductByIds(productIds);
    }
}
