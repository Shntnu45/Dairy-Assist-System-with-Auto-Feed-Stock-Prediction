package com.Dairy.assist.repository;

import com.Dairy.assist.entity.FeedReorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedReorderRepository extends JpaRepository<FeedReorder, Long> {
    
    // Get all reorders sorted by date
    List<FeedReorder> findAllByOrderByRequestDateDesc();
}