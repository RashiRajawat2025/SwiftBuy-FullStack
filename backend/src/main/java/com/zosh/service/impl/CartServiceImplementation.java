package com.zosh.service.impl;

import com.zosh.exception.ProductException;
import com.zosh.model.Cart;
import com.zosh.model.CartItem;
import com.zosh.model.Product;
import com.zosh.model.User;
import com.zosh.repository.CartItemRepository;
import com.zosh.repository.CartRepository;
import com.zosh.service.CartService;
import com.zosh.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class CartServiceImplementation implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        // ✅ Create a new cart if not found
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setCouponPrice(0); // default values
            cart.setTotalItem(0);
            cart.setTotalMrpPrice(0);
            cart.setTotalSellingPrice(0);
            cart.setDiscount(0);
            cart.setCartItems(new HashSet<>()); // initialize cart items
            cart = cartRepository.save(cart);
        }

        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;

        if (cart.getCartItems() != null) {
            for (CartItem cartsItem : cart.getCartItems()) {
                totalPrice += cartsItem.getMrpPrice();
                totalDiscountedPrice += cartsItem.getSellingPrice();
                totalItem += cartsItem.getQuantity();
            }
        }

        cart.setTotalMrpPrice(totalPrice);
        cart.setTotalItem(totalItem);
        cart.setTotalSellingPrice(totalDiscountedPrice - cart.getCouponPrice());
        cart.setDiscount(calculateDiscountPercentage(totalPrice, totalDiscountedPrice));

        return cartRepository.save(cart);
    }

    public static int calculateDiscountPercentage(double mrpPrice, double sellingPrice) {
        if (mrpPrice <= 0) {
            return 0;
        }
        double discount = mrpPrice - sellingPrice;
        double discountPercentage = (discount / mrpPrice) * 100;
        return (int) discountPercentage;
    }

    @Override
    public CartItem addCartItem(User user,
                                Product product,
                                String size,
                                int quantity
    ) throws ProductException {

        Cart cart = findUserCart(user); // will never be null now

        CartItem isPresent = cartItemRepository.findByCartAndProductAndSize(cart, product, size);

        if (isPresent == null) {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUserId(user.getId());
            cartItem.setSellingPrice(quantity * product.getSellingPrice());
            cartItem.setMrpPrice(quantity * product.getMrpPrice());
            cartItem.setSize(size);
            cartItem.setCart(cart);

            cart.getCartItems().add(cartItem); // safely add to initialized list
            return cartItemRepository.save(cartItem);
        }

        return isPresent;
    }
}
