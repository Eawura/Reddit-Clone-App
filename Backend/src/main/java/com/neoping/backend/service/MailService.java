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
        MimeMessagePreparator preparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, true);
            messageHelper.setTo(notificationEmail.getRecipient());
            messageHelper.setSubject(notificationEmail.getSubject());
            messageHelper.setText(mailContentBuilder.build(notificationEmail.getBody()), true);
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
