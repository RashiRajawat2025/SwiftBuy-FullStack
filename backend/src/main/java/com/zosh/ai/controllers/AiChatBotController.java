package com.zosh.ai.controllers;

import com.zosh.ai.services.AiChatBotService;
import com.zosh.model.User;
import com.zosh.request.Prompt;
import com.zosh.response.ApiResponse;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/ai/chat")
@RequiredArgsConstructor
public class AiChatBotController {

    private final AiChatBotService aiChatBotService;
    private final UserService userService;

    @PostMapping()
    public ResponseEntity<ApiResponse> generate(
            @RequestBody Prompt prompt,
            @RequestParam(required = false) Long productId,
            @RequestHeader(required = false, name = "Authorization") String jwt) throws Exception {

        // Find the user ONLY if a JWT is present
        User user = null;
        if (jwt != null) {
            user = userService.findUserProfileByJwt(jwt);
        }

        // It's safer to pass the user object or just the ID after checking for null
        Long userId = (user != null) ? user.getId() : null;

        String message = prompt.getPrompt();
        if (productId != null) {
            message = "The product id is " + productId + ", " + message;
        }

        ApiResponse apiResponse = aiChatBotService.aiChatBot(message, productId, userId);

        return ResponseEntity.ok(apiResponse);
    }
}