package com.zosh.controller;

import com.zosh.exception.ProductException;
import com.zosh.exception.UserException;
import com.zosh.model.CartItem;
import com.zosh.model.Product; // Make sure this import is present
import com.zosh.model.User;
import com.zosh.request.AddItemRequest;
import com.zosh.service.CartService;
import com.zosh.service.ProductService;
import com.zosh.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/cart_items")
public class CartItemController {

    private final CartService cartService;
    private final UserService userService;
    private final ProductService productService;

    // Updated constructor to match the fields
    public CartItemController(CartService cartService,
                              UserService userService,
                              ProductService productService) {
        this.cartService = cartService;
        this.userService = userService;
        this.productService = productService;
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addCartItem(@RequestBody AddItemRequest request, Principal principal)
            throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(principal.getName());
        if (user == null) {
            throw new UserException("User not found with provided token.");
        }

        // Step 1: Get the full Product object from the database using the ID
        Product product = productService.findProductById(request.getProductId());

        // Step 2: Call the service with the correct arguments (User, Product, String, int)
        CartItem cartItem = cartService.addCartItem(
                user,
                product,
                request.getSize(),
                request.getQuantity()
        );

        return new ResponseEntity<>(cartItem, HttpStatus.CREATED);
    }
}