package com.neoping.backend.service;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
class MailContentBuilder {

    private final TemplateEngine templateEngine;

    String build(String message) {
        Context context = new Context();
        context.setVariable("message", message);
        return templateEngine.process("mailTemplate", context);
    }

    public String buildVerificationEmail(String token, String recipientEmail) {
        Context context = new Context();
        context.setVariable("token", token);
        context.setVariable("email", recipientEmail);
        return templateEngine.process("verificationEmailTemplate", context);
    }

    public String buildWelcomeEmail(String username, String recipientEmail) {
        Context context = new Context();
        context.setVariable("username", username);
        context.setVariable("email", recipientEmail);
        return templateEngine.process("welcomeEmailTemplate", context);
    }
}