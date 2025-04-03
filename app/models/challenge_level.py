# app/models/challenge_level.py
import enum

class ChallengeLevel(enum.Enum):
    MUY_FACIL = (10, 1)    # xp=10, coins=1
    FACIL = (30, 5)
    NORMAL = (60, 20)
    DIFICIL = (200, 40)
    MUY_DIFICIL = (500, 100)

    def xp_value(self):
        return self.value[0]

    def coins_value(self):
        return self.value[1]
