package com.budget.Budgeting.repository;

import org.springframework.data.repository.CrudRepository;

import com.budget.Budgeting.model.Account;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
public interface AccountRepository extends CrudRepository<Account, Integer> {

}