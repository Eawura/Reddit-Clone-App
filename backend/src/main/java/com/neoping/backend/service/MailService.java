package com.neoping.backend.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.neoping.backend.exception.SpringRedditException;
import com.neoping.backend.model.NotificationEmail;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@AllArgsConstructor
@Slf4j
public class MailService {
    private final JavaMailSender javaMailSender;
    private final MailContentBuilder mailContentBuilder;

    @Async
    public void sendMail(NotificationEmail notificationEmail) {
        log.info("Sending email to: {}", notificationEmail.getRecipient());
        log.info("Email subject: {}", notificationEmail.getSubject());
        log.info("Email body: {}", notificationEmail.getBody());

        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            try {
                messageHelper.setTo(notificationEmail.getRecipient());
                messageHelper.setSubject(notificationEmail.getSubject());
                String emailContent = mailContentBuilder.build(notificationEmail.getBody());
                messageHelper.setText(emailContent, true);
                log.info("Email content generated successfully: {}", emailContent);
            } catch (Exception e) {
                log.error("Error preparing email: {}", e.getMessage(), e);
                throw e;
            }
        };

        try {
            javaMailSender.send(preparator);
            log.info("Activation email sent to {}", notificationEmail.getRecipient());
        } catch (Exception e) {
            log.error("Exception occurred when sending mail to {}", notificationEmail.getRecipient(), e);
            // Optionally, throw a custom exception here
            throw new SpringRedditException(
                    "Exception occurred when sending mail to " + notificationEmail.getRecipient(), e);
        }
    }
}
