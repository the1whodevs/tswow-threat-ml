from http.server import HTTPServer, BaseHTTPRequestHandler
# Import Gym & Stuff
import gym
from gym import Env
from gym.spaces import Discrete, MultiDiscrete, Dict

# Import helpers
import numpy as np
import random
import os

import sys

# Import Stable baselines & stuff
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
from stable_baselines3.common.evaluation import evaluate_policy

class BattleEnv(Env):
    def __init__(self):
        self.action_space = Discrete(10) # id to attack
        self.observation_space = Dict({'0':MultiDiscrete([3000, 10, 30000]),
                                       '1':MultiDiscrete([3000, 10, 30000]),
                                       '2':MultiDiscrete([3000, 10, 30000]),
                                       '3':MultiDiscrete([3000, 10, 30000]),
                                       '4':MultiDiscrete([3000, 10, 30000]),
                                       '5':MultiDiscrete([3000, 10, 30000]),
                                       '6':MultiDiscrete([3000, 10, 30000]),
                                       '7':MultiDiscrete([3000, 10, 30000]),
                                       '8':MultiDiscrete([3000, 10, 30000]),
                                       '9':MultiDiscrete([3000, 10, 30000])})
        
        self.state = {'0':np.array([random.randint(1500, 2999),random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '1':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '2':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '3':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '4':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '5':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '6':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '7':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '8':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '9':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)])}
        self.dps = 4500
        self.timer = 360
        pass
    
    def step(self, action):
        
        # action is target id
        target_key = str(action)
        target = self.state[target_key]
        
        reward = 0
        
        # Give reward if the boss selected an alive player
        if target[3] <= 0:
            reward -= 1
        else:
            reward += 1
           
        # Give reward if the boss selected the slowest player
        slowest = '0'
        
        for key in self.state:
            if self.state[slowest][1] > self.state[key][1]:
                slowest = key
                
        if target_key == slowest:
            reward += 2
        else:
            reward -= 2
        
        # Prioritize melee players
        if target[2] == 1:
            reward -= 1
        else:
            reward += 1
            
        # Prioritze highest dps
        highest_dps = '0'
        
        for key in self.state:
            if self.state[key][0] > self.state[highest_dps][0]:
                highest_dps = key
                
        if target_key == key:
            reward += 3
        else:
            reward -= 3
        
        # Randomly adjust movement of players
        for key in self.state:
            self.state[key][1] += random.randint(-2, 2)
            if self.state[key][1] < 0:
                self.state[key][1] = 0 # stunned!
            elif self.state[key][1] > 9:
                self.state[key][1] = 9 # super speed!
        
        target[3] -= self.dps
        
        if target[3] < 0:
            target[3] = 0
        
        self.timer -= 1
        
        done = self.timer == 0
        info = {}
        self.state[target_key] = target
        return self.state, reward, done, info
    
    def render(self):
        pass
    
    def reset(self):
        self.state = {'0':np.array([random.randint(1500, 2999),random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '1':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '2':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '3':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '4':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '5':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '6':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '7':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '8':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)]),
                      '9':np.array([random.randint(1500, 2999), random.randint(0, 9), random.randint(0, 1), random.randint(20000, 30000)])}
        self.timer = 360
        return self.state

env = BattleEnv()

save_name = 'WoW_v2_CUDA_PPO_355K'
save_path = os.path.join('Training', 'Saved Models', save_name)

model = PPO.load(save_path, env)

class MyRequestHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        # self.path contains a '/' as a first character and then 
        # all our arguments comma separated.
        # arguments come in a 'dps,runspeed,maxhp;dps,runspeed,maxhp;dps,runspeed,maxhp;' fashion
        players = self.path[1:].split(';')

        counter = 0
        args = {}

        for player in players:
            playerData = player.split(',')
            
            #print('Player : ' + player)
            #print(playerData)
            
            dpsStr = playerData[0]
            runSpeedStr = playerData[1]
            maxHpStr = playerData[2]
            
            if dpsStr == '':
                print('Player contained empty dps: ' + player)
                continue
            
            if runSpeedStr == '':
                print('Player contained empty runSpeed: ' + player)
                continue
            
            if maxHpStr == '':
                print('Player contained empty maxHp: ' + player)
                continue
            
            dps = round(float(dpsStr))
            runSpeed = round(float(runSpeedStr))
            maxHp = round(float((maxHpStr)))
            args[str(counter)] = np.array([dps, runSpeed, maxHp])
            counter += 1
            
        if len(args) > 10:
            args = dict(list(args.items())[:10])
        elif len(args) < 10:
            diff = 10 - len(args)
            
        for x in range(diff):
            args[str(counter)] = np.array([0, 0, 0])
            counter += 1

        result = model.predict(args)
        self.wfile.write(bytearray(str(result[0]).encode()))


httpd = HTTPServer(('localhost', 5555), MyRequestHandler)
httpd.serve_forever()