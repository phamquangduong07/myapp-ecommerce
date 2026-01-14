package com.project.myapp.servers.impl;

import com.project.myapp.dtos.CartItemDTO;
import com.project.myapp.dtos.OrderDTO;
import com.project.myapp.exceptions.DataNotFoundException;
import com.project.myapp.models.*;
import com.project.myapp.repositories.OrderDetailRepository;
import com.project.myapp.repositories.OrderRepository;
import com.project.myapp.repositories.ProductRepository;
import com.project.myapp.repositories.UserRepository;
import com.project.myapp.servers.IOrderService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ModelMapper modelMapper;



    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO) throws Exception {

        User user = userRepository
                .findById(orderDTO.getUserId())
                .orElseThrow(() ->
                        new DataNotFoundException("Cannot find user with id: " + orderDTO.getUserId()));

        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        Order order = new Order();
        modelMapper.map(orderDTO, order);

        order.setUser(user);
        order.setOrderDate(LocalDate.now());
        order.setStatus(OrderStatus.PENDING);
        order.setActive(true);

        LocalDate shippingDate = orderDTO.getShippingDate() == null
                ? LocalDate.now()
                : orderDTO.getShippingDate();

        if (shippingDate.isBefore(LocalDate.now())) {
            throw new DataNotFoundException("Date must be at least today!");
        }
        order.setShippingDate(shippingDate);

        // 🔥 TOTAL MONEY – tính ở backend
        BigDecimal totalMoney = BigDecimal.ZERO;

        List<OrderDetail> orderDetails = new ArrayList<>();

        for (CartItemDTO cartItemDTO : orderDTO.getCartItems()) {

            Product product = productRepository.findById(cartItemDTO.getProductId())
                    .orElseThrow(() ->
                            new DataNotFoundException("Product not found with id: " + cartItemDTO.getProductId()));

            int quantity = cartItemDTO.getQuantity();

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(product);
            orderDetail.setNumberOfProducts(quantity);
            orderDetail.setPrice(product.getPrice());

            orderDetail.setTotalMoney(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            BigDecimal itemTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(quantity));

            totalMoney = totalMoney.add(itemTotal);

            orderDetails.add(orderDetail);
        }

        // set tổng tiền SAU KHI tính xong
        order.setTotalMoney(totalMoney.floatValue());

        orderRepository.save(order);
        orderDetailRepository.saveAll(orderDetails);

        return order;
    }

    @Override
    public Order getOrder(Long id) {
        Order selectedOrder = orderRepository.findById(id).orElse(null);
        return selectedOrder;
    }

    @Override
    @Transactional
    public Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        User existingUser = userRepository.findById(
                orderDTO.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id: " + id));

        modelMapper.typeMap(OrderDTO.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        modelMapper.map(orderDTO, order);
        order.setUser(existingUser);
        System.out.println(orderDTO.getStatus());
        order.setStatus(orderDTO.getStatus());
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);

        if(order != null) {
            order.setActive(false);

            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword, pageable);
    }
}
