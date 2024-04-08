package com.budget.Budgeting.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.budget.Budgeting.model.Account;
import com.budget.Budgeting.repository.AccountRepository;

@RestController
@RequestMapping(path="/budgeting")
public class UserController {
    @Autowired
    private AccountRepository accountRepository;
    
    @PostMapping(path="/user")
    public @ResponseBody String addNewUser(@RequestParam String name, @RequestParam String email) {
        Account a = new Account();
        a.setName(name);
        a.setEmail(email);
        accountRepository.save(a);
        return "Saved";
    }

    @GetMapping(path="/users")
    public @ResponseBody Iterable<Account> getAllUsers() {
        return accountRepository.findAll();
    }

    @RequestMapping("/user")
    public Principal user(Principal user) {
        return user;
    }

}
