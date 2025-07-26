package com.neoping.backend.model;

import java.util.Arrays;
import com.neoping.backend.exception.SpringRedditException;

public enum VoteType {
    UPVOTE(1),
    DOWNVOTE(-1);

    private int direction;

    VoteType(int direction) {
        this.direction = direction;
    }

    public int getDirection() {
        return direction;
    }

    public static VoteType lookup(Integer direction){
        return Arrays.stream(VoteType.values())
        .filter(value -> value.getDirection() == direction)
        .findAny()
        .orElseThrow(() -> new SpringRedditException("Vote not found "));
        
    }
}
