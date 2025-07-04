package com.neoping.backend.mapper;

import com.neoping.backend.dto.CommentDto;
import com.neoping.backend.model.Comment;
import com.neoping.backend.model.Post;
import com.neoping.backend.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-07-04T01:57:44+0000",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.42.50.v20250628-1110, environment: Java 21.0.7 (Eclipse Adoptium)"
)
@Component
public class CommentMapperImpl implements CommentMapper {

    @Override
    public Comment map(CommentDto commentDto, Post post, User user) {
        if ( commentDto == null && post == null && user == null ) {
            return null;
        }

        Comment.CommentBuilder comment = Comment.builder();

        if ( commentDto != null ) {
            comment.content( commentDto.getContent() );
        }
        if ( post != null ) {
            comment.post( post );
            comment.postName( post.getPostName() );
            comment.url( post.getUrl() );
        }
        comment.user( user );
        comment.createdAt( java.time.LocalDateTime.now() );

        return comment.build();
    }

    @Override
    public CommentDto mapToDto(Comment comment) {
        if ( comment == null ) {
            return null;
        }

        CommentDto commentDto = new CommentDto();

        Long id = commentParentCommentId( comment );
        if ( id != null ) {
            commentDto.setParentCommentId( id );
        }
        else {
            commentDto.setParentCommentId( (long) 0L );
        }
        commentDto.setContent( comment.getContent() );
        commentDto.setCreatedAt( comment.getCreatedAt() );
        commentDto.setId( comment.getId() );

        commentDto.setPostId( comment.getPost().getId() );
        commentDto.setUserName( comment.getUser().getUsername() );
        commentDto.setUserId( comment.getUser().getId() );

        return commentDto;
    }

    private Long commentParentCommentId(Comment comment) {
        if ( comment == null ) {
            return null;
        }
        Comment parentComment = comment.getParentComment();
        if ( parentComment == null ) {
            return null;
        }
        Long id = parentComment.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
