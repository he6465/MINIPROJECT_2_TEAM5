package com.hrt.comment.dto;

import lombok.Data;

@Data
public class CommentCreateReq {
    private Long routineId;
    private String content;
}

