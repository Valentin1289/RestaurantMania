package com.codecooll.RestaurantMania.accounts.service;

import com.codecooll.RestaurantMania.accounts.model.Account;
import com.codecooll.RestaurantMania.accounts.model.User;
import com.codecooll.RestaurantMania.restaurant.model.Restaurant;
import com.codecooll.RestaurantMania.restaurant.service.menuService.MenuRepository;
import com.codecooll.RestaurantMania.restaurant.service.restaurantService.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;

    private final RestaurantRepository restaurantRepository;

    public void addNewUser(User user) {
        Optional<Account> accountByEmail = accountRepository.findAccountByEmail(user.getEmail());
        if (accountByEmail.isPresent()) {
            throw new IllegalStateException("Email taken");
        }
        accountRepository.save(user);
    }

    public User getAccountById(Long id) {
        Optional<Account> accountByID = accountRepository.findById(id);
        return (User) accountByID.orElse(null);
    }

    public User getAccountByEmail(String user_email) {
        return (User) accountRepository.findAccountByEmail(user_email).orElse(null);
    }

    public User getAccountByEmailForAutologin(String user_email) {
        User user = (User) accountRepository.findAccountByEmailForAutologin(user_email).orElse(null);
        List<Restaurant> user_restaurants = restaurantRepository.findAllRestaurantsOfUser(user.getId());
        user.setRestaurants(user_restaurants);
        return user;
    }

}
