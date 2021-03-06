package com.generator.common.controllers;

import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
public abstract class AbstractResourceController<T> {
    private final PagingAndSortingRepository<T, Integer> repository;

    @GetMapping
    @ApiOperation(value = "get all", notes = "Get all entities")
    public ResponseEntity<Iterable<T>> getAll() { return new ResponseEntity<>(repository.findAll(), HttpStatus.OK); }

    @GetMapping({"/{id}"})
    @ApiOperation(value = "get by id", notes = "Get single entity by id")
    public ResponseEntity<T> get(@PathVariable Integer id) {
        return repository.findById(id).map(t -> new ResponseEntity<>(t, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity(HttpStatus.NOT_FOUND));
    }

    @PostMapping()
    @ApiOperation(value = "create new", notes = "Create new entity")
    public ResponseEntity<T> create(@RequestBody T entity) {
        //TODO: add support location header
        return new ResponseEntity<>(repository.save(entity), HttpStatus.CREATED);
    }

    @PutMapping({"/{id}"})
    @ApiOperation(value = "update by id", notes = "Update entity by id")
    public ResponseEntity<T> update(@PathVariable("id") Integer id, @RequestBody T entity) {
        return repository.findById(id).map(t -> {
            BeanUtils.copyProperties(entity, t, "id");
            return new ResponseEntity<>(repository.save(t), HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping({"/{id}"})
    @ApiOperation(value = "delete by id", notes = "Delete entity by id")
    public ResponseEntity delete(@PathVariable("id") Integer id) {
        return repository.findById(id).map(t -> {
            repository.deleteById(id);
            return new ResponseEntity(HttpStatus.OK);
        }).orElseGet(() -> new ResponseEntity(HttpStatus.NOT_FOUND));
    }
}
