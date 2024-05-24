settings
{
	main
	{
		Название режима: "Rainy Reins J2T6EE"
		Описание: "shutter them all, with many other mechanics"
	}

	lobby
	{
		Возврат в лобби: Отключен
		Голосовой чат матча: Вкл.
		Игра в режиме «Лаборатории» если доступно: Да
		Максимум игроков FFA: 10
		Открыть для игроков в очереди: Да
		Смена полей боя: Отключена
	}

	modes
	{
		disabled Гибридный режим
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Гибридный режим
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Захват точек
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Захват флага
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Командная схватка
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Контроль
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Контроль
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Мастерство героев
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Натиск
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Натиск
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Охота за головами
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Разминка
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Сопровождение
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Сопровождение
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		Схватка
		{
			Время матча в минутах: 12
			Очков для победы: 35
			Пассивный бонус к здоровью танков: Откл.

			enabled maps
			{
				Черный лес 972777519512063901
			}
		}

		disabled Точка возгорания
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Точка возгорания
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		disabled Учебный полигон
		{
			Пассивный бонус к здоровью танков: Откл.
		}

		Общие
		{
			Аптечки: Откл.
			Лимит героев: Откл.
			Начало матча в режиме: Вручную
			Случайный герой при возрождении: Вкл.
		}
	}

	heroes
	{
		Общие
		{
			Райнхардт
			{
				Время восстановления: Рывок: 0%
				Зарядка суперспособности Землетрясение: 329%
				Зарядка суперспособности в бою Землетрясение: 400%
				Пассивная зарядка суперспособности Землетрясение: 350%
			}

			enabled heroes
			{
				Райнхардт
			}
		}
	}

	workshop
	{
		DoubleJump CoolDown: 3000
		DoubleJump impulse: 9000
		FireStrike maxRange Teleportation: 65200
		Life steal percent: 75000
		Shutter impulse multiplier: 25000
		Shutter time multiplier: 18000
	}

	extensions
	{
		Energy Explosion Effects
		Explosion Sounds
	}
}

variables
{
	global:
		0: doNotTouch
		1: WorkShop_settings_arr
		2: boosters_positions
		3: boosters_status
		4: iterator

	player:
		1: fireStrike_pos_toTP
		2: doubleJump_CD
		3: doubleJump_SpacePressed
		4: shutter_time_inAir
		5: damageDealtPercent
		6: shutter_cast_timer
		7: shtr_negativeVertSpeed_notZero
		8: shtr_inProcess
		9: damageRecieved_entitys_arr
		10: fireStrike_pos_fromTP
		11: FireStrike_posChaiser
		12: isAdmin
		13: boosterTime
}

rule(".                                                                             Inizialization")
{
	event
	{
		Ongoing - Global;
	}
}

rule("Global Setup")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		Global.WorkShop_settings_arr[1] = Workshop Setting Toggle(Custom String("Global"), Custom String("DoubleJump Enabled"), True, 0);
		Global.WorkShop_settings_arr[2] = Workshop Setting Real(Custom String("Global"), Custom String("DoubleJump CoolDown"), 3, 0, 12,
			0);
		Global.WorkShop_settings_arr[6] = Workshop Setting Real(Custom String("Global"), Custom String("DoubleJump impulse"), 9, 5, 25, 0);
		Global.WorkShop_settings_arr[5] = Workshop Setting Real(Custom String("Global"), Custom String("Life steal percent"), 75, 10, 300,
			0);
		Global.WorkShop_settings_arr[7] = Workshop Setting Toggle(Custom String("Global"), Custom String("Respawn with half ult"), True,
			0);
		Global.WorkShop_settings_arr[8] = Workshop Setting Real(Custom String("Global"), Custom String("Boosters cooldown"), 15, 0, 45, 0);
		Global.WorkShop_settings_arr[9] = Workshop Setting Real(Custom String("Global"), Custom String("Boosters duration"), 10, 5, 20, 0);
		Global.WorkShop_settings_arr[0] = Workshop Setting Real(Custom String("Reinhardt"), Custom String(
			"FireStrike maxRange Teleportation"), 40, 5, 150, 0);
		Global.WorkShop_settings_arr[3] = Workshop Setting Real(Custom String("Reinhardt"), Custom String("Shutter time multiplier"), 18,
			0, 100, 0);
		Global.WorkShop_settings_arr[4] = Workshop Setting Real(Custom String("Reinhardt"), Custom String("Shutter impulse multiplier"),
			25, 0, 100, 0);
		Global.boosters_status = Empty Array;
		Modify Global Variable(boosters_positions, Append To Array, Vector(-19.240, 12.110, 4.790));
		For Global Variable(iterator, 0, Count Of(Global.boosters_positions), 1);
			Global.boosters_status[Evaluate Once(Global.iterator)] = Global.doNotTouch[0];
			Create Effect(All Players(All Teams), Ring, Global.boosters_status[Evaluate Once(Global.iterator)] == 0 ? Color(Lime Green)
				: Color(Rose), Global.boosters_positions[Evaluate Once(Global.iterator)], 3, Visible To Position and Radius);
			Create In-World Text(All Players(All Teams), Custom String("{0}", Global.boosters_status[Evaluate Once(Global.iterator)
				] == 0 ? Custom String("Ready") : (Global.boosters_status[Evaluate Once(Global.iterator)
				] < Global.WorkShop_settings_arr[9] ? Global.boosters_status[Evaluate Once(Global.iterator)] : Custom String("{0} - {1}",
				Global.boosters_status[Evaluate Once(Global.iterator)], Global.boosters_status[Evaluate Once(Global.iterator)].boosterTime))),
				Global.boosters_positions[Evaluate Once(Global.iterator)], 2, Clip Against Surfaces, Visible To Position and String, Color(
				White), Default Visibility);
		End;
	}
}

rule("Local Setup")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	actions
	{
		Event Player.damageRecieved_entitys_arr = Empty Array;
		Event Player.shtr_inProcess = False;
		Event Player.damageDealtPercent = 125;
		Set Damage Dealt(Event Player, 125);
		Create HUD Text(Event Player, Null, Custom String("Double Jump CD"), Null, Left, 0, Color(Red), Color(White), Color(White),
			Visible To and String, Default Visibility);
		Create Progress Bar HUD Text(Event Player, (Global.WorkShop_settings_arr[2] - Event Player.doubleJump_CD)
			/ Global.WorkShop_settings_arr[2] * 100, Custom String(""), Left, 0, Color(Green), Color(White), Values, Default Visibility);
		Create HUD Text(Event Player, Null, Custom String("Firestrike Teleport"), Null, Left, 0, Color(Red), Color(White), Color(White),
			Visible To and String, Default Visibility);
		Create Progress Bar HUD Text(Event Player, (Distance Between(Event Player.fireStrike_pos_toTP, Event Player.fireStrike_pos_fromTP)
			- (Distance Between(Event Player.fireStrike_pos_toTP, Event Player.fireStrike_pos_fromTP) - Distance Between(
			Event Player.fireStrike_pos_fromTP, Event Player.FireStrike_posChaiser))) / Distance Between(Event Player.fireStrike_pos_toTP,
			Event Player.fireStrike_pos_fromTP) * 100, Custom String(""), Left, 0, Color(Orange), Color(White), Values,
			Default Visibility);
		Create HUD Text(Event Player, Custom String("{0}",
			Event Player.shtr_inProcess ? 100 + Event Player.shutter_time_inAir * Event Player.shutter_time_inAir * Global.WorkShop_settings_arr[3] + Event Player.shutter_time_inAir * (
			Event Player.shtr_negativeVertSpeed_notZero <= 1 ? 1 : Event Player.shtr_negativeVertSpeed_notZero)
			+ Global.WorkShop_settings_arr[4] : Event Player.damageDealtPercent), Custom String("damage %"), Null, Top, 0, Color(Red),
			Color(White), Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Null, Custom String("You do more damage the longer you stay in the air"), Null, Right, 0, Color(Red),
			Color(White), Color(White), Visible To and String, Default Visibility);
	}
}

rule("admin setup")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Custom String("{0}", Event Player) == Custom String("ImPhaIR");
	}

	actions
	{
		Set Status(Event Player, Null, Phased Out, 9999);
		Event Player.isAdmin = True;
		Set Status(Event Player, Null, Burning, 9999);
		Create In-World Text(All Players(All Teams), Custom String("Creator"), Update Every Frame(Eye Position(Event Player)) + Vector(0,
			1, 0), 1, Clip Against Surfaces, Visible To Position and String, Color(Purple), Default Visibility);
		"log"
		Create HUD Text(Event Player, Null, Custom String("{0}", Count Of(Global.boosters_positions)), Null, Left, 0, Color(Red), Color(
			White), Color(White), Visible To and String, Default Visibility);
	}
}

rule(".                                                                             Ability mods")
{
	event
	{
		Ongoing - Global;
	}
}

rule("FIreStrike TP")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Using Ability 2(Event Player) == True;
	}

	actions
	{
		Wait(0.600, Ignore Condition);
		Abort If(Has Status(Event Player, Hacked) || Has Status(Event Player, Asleep) || Has Status(Event Player, Knocked Down));
		Event Player.fireStrike_pos_toTP = Ray Cast Hit Position(Update Every Frame(Eye Position(Event Player)), Update Every Frame(
			Eye Position(Event Player)) + Update Every Frame(Facing Direction Of(Event Player)) * Global.WorkShop_settings_arr[0], Null,
			Event Player, True);
		Event Player.fireStrike_pos_fromTP = Eye Position(Event Player);
		Event Player.FireStrike_posChaiser = Eye Position(Event Player);
		Chase Player Variable At Rate(Event Player, FireStrike_posChaiser, Event Player.fireStrike_pos_toTP, 26.660, Destination and Rate);
		Wait(Distance Between(Update Every Frame(Eye Position(Event Player)), Event Player.fireStrike_pos_toTP) / 26.660,
			Ignore Condition);
		If(Is Dead(Event Player));
			Event Player.fireStrike_pos_toTP = 0;
			Abort;
			Stop Chasing Player Variable(Event Player, FireStrike_posChaiser);
			Chase Player Variable Over Time(Event Player, FireStrike_posChaiser, Event Player.fireStrike_pos_fromTP, 1,
				Destination and Duration);
		End;
		Teleport(Event Player, Event Player.fireStrike_pos_toTP);
		Stop Chasing Player Variable(Event Player, FireStrike_posChaiser);
		Chase Player Variable Over Time(Event Player, FireStrike_posChaiser, Event Player.fireStrike_pos_fromTP, 1,
			Destination and Duration);
	}
}

rule("doubleJump rule")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Global.WorkShop_settings_arr[1] == True;
		Event Player.doubleJump_CD <= 0;
		Is Button Held(Event Player, Button(Jump)) == True;
		Is Alive(Event Player) == True;
	}

	actions
	{
		If(Event Player.doubleJump_SpacePressed < 1 && Altitude Of(Event Player) <= 0.300);
			Event Player.doubleJump_SpacePressed += 1;
			Wait Until(!Is Button Held(Event Player, Button(Jump)), 10);
			Abort;
		End;
		Event Player.doubleJump_SpacePressed += 1;
		Event Player.doubleJump_CD = Global.WorkShop_settings_arr[2];
		Chase Player Variable At Rate(Event Player, doubleJump_CD, 0, 1, None);
		Play Effect(All Players(All Teams), Ring Explosion, Color(Green), Evaluate Once(Update Every Frame(Position Of(Event Player))), 5);
		Apply Impulse(Event Player, Up, Global.WorkShop_settings_arr[6], To World, Cancel Contrary Motion);
		Wait Until(Event Player.doubleJump_CD <= 0, 12);
	}
}

rule("doubleJump helper")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is In Air(Event Player) == True;
	}

	actions
	{
		Wait Until(Is On Ground(Event Player), 30);
		Event Player.doubleJump_SpacePressed = 0;
	}
}

rule("shutter mechanic")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Ultimate Charge Percent(Event Player) == 100;
	}

	actions
	{
		While(Ultimate Charge Percent(Event Player) == 100);
			Wait Until(Is Button Held(Event Player, Button(Ultimate)), 3000);
			Abort If(Has Status(Event Player, Hacked) || Has Status(Event Player, Asleep) || Has Status(Event Player, Knocked Down) || Is Dead(
				Event Player));
			Stop Chasing Player Variable(Event Player, shutter_time_inAir);
			Event Player.shutter_time_inAir = 0;
			Chase Player Variable At Rate(Event Player, shutter_time_inAir, 6000, 3, Destination and Rate);
			Stop Chasing Player Variable(Event Player, shutter_cast_timer);
			Event Player.shutter_cast_timer = 0.500;
			Chase Player Variable At Rate(Event Player, shutter_cast_timer, 0, 1, Destination and Rate);
			Event Player.shtr_inProcess = True;
			Wait Until(Is On Ground(Event Player), 200);
			Wait(Evaluate Once(Event Player.shutter_cast_timer), Ignore Condition);
			Stop Chasing Player Variable(Event Player, shutter_cast_timer);
			Play Effect(Event Player, DVa Self Destruct Explosion Sound, Color(White), Event Player, 70);
			Play Effect(All Players(All Teams), DVa Self Destruct Explosion Effect, Color(White), Evaluate Once(Position Of(Event Player)
				+ Direction From Angles(Horizontal Facing Angle Of(Event Player), 0) * 3), 70);
			Play Effect(Event Player, Buff Impact Sound, Color(White), Event Player, 50);
			Event Player.damageDealtPercent = 100 + Event Player.shutter_time_inAir * Event Player.shutter_time_inAir * Global.WorkShop_settings_arr[3] + Event Player.shutter_time_inAir * (
				Event Player.shtr_negativeVertSpeed_notZero <= 1 ? 1 : Event Player.shtr_negativeVertSpeed_notZero)
				+ Global.WorkShop_settings_arr[4];
			Set Damage Dealt(Event Player,
				100 + Event Player.shutter_time_inAir * Event Player.shutter_time_inAir * Global.WorkShop_settings_arr[3] + Event Player.shutter_time_inAir * (
				Event Player.shtr_negativeVertSpeed_notZero <= 1 ? 1 : Event Player.shtr_negativeVertSpeed_notZero)
				+ Global.WorkShop_settings_arr[4]);
			Stop Chasing Player Variable(Event Player, shutter_time_inAir);
			Event Player.shtr_inProcess = False;
			Wait(0.500, Ignore Condition);
			Event Player.damageDealtPercent = 125;
			Set Damage Dealt(Event Player, 125);
		End;
	}
}

rule("shutter impulse handler")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is In Air(Event Player) == True;
		Event Player.shtr_inProcess == True;
	}

	actions
	{
		Event Player.shtr_negativeVertSpeed_notZero = Vertical Speed Of(Event Player) * -1;
		Wait(0.016, Ignore Condition);
		Loop If Condition Is True;
	}
}

rule(".                                                                             General mods")
{
	event
	{
		Ongoing - Global;
	}
}

rule("donot stuck skybox")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Y Component Of(Position Of(Event Player)) >= 43.050;
	}

	actions
	{
		Disable Movement Collision With Environment(Event Player, True);
		Wait Until(Y Component Of(Position Of(Event Player)) <= 42, 10);
		Enable Movement Collision With Environment(Event Player);
	}
}

rule("cannot drop off the map")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Y Component Of(Update Every Frame(Position Of(Event Player))) <= 8.500;
	}

	actions
	{
		Play Effect(All Players(All Teams), Ring Explosion, Color(Green), Evaluate Once(Update Every Frame(Position Of(Event Player))), 5);
		Apply Impulse(Event Player, Up, 6, To World, Cancel Contrary Motion);
		Event Player.doubleJump_CD -= Global.WorkShop_settings_arr[2] - Event Player.doubleJump_CD < Global.WorkShop_settings_arr[2] / 4 ? Event Player.doubleJump_CD : Global.WorkShop_settings_arr[2] / 4;
	}
}

rule("f to ult")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Button Held(Event Player, Button(Interact)) == True;
		Event Player.isAdmin == True;
	}
}

rule("damage indication")
{
	event
	{
		Player took damage;
		All;
		Все;
	}

	actions
	{
		Create In-World Text(Filtered Array(All Players(All Teams), Current Array Element != Event Player), Custom String("{0}\n{1}%",
			Distance Between(Vector(X Component Of(Position Of(Victim)), 0, Z Component Of(Position Of(Victim))), Vector(X Component Of(
			Position Of(Attacker)), 0, Z Component Of(Position Of(Attacker))))
			<= 5.500 ? 150 * Attacker.damageDealtPercent / 100 : 50 * Attacker.damageDealtPercent / 100, Attacker.damageDealtPercent,
			Distance Between(Vector(X Component Of(Position Of(Victim)), 0, Z Component Of(Position Of(Victim))), Vector(X Component Of(
			Position Of(Attacker)), 0, Z Component Of(Position Of(Attacker))))), Evaluate Once(Eye Position(Event Player) + Vector(0, 1,
			0)), 2, Clip Against Surfaces, None, Color(Red), Default Visibility);
		Modify Player Variable(Event Player, damageRecieved_entitys_arr, Append To Array, Last Text ID);
		Wait(4, Ignore Condition);
		Destroy In-World Text(Event Player.damageRecieved_entitys_arr[0]);
		Modify Player Variable(Event Player, damageRecieved_entitys_arr, Remove From Array By Index, 0);
	}
}

rule("lifesteal")
{
	event
	{
		Player dealt damage;
		All;
		Все;
	}

	actions
	{
		Add Health Pool To Player(Event Player, Health, ((Distance Between(Vector(X Component Of(Position Of(Victim)), 0, Z Component Of(
			Position Of(Victim))), Vector(X Component Of(Position Of(Attacker)), 0, Z Component Of(Position Of(Attacker))))
			<= 1.800 ? 150 * Attacker.damageDealtPercent / 100 : 50 * Attacker.damageDealtPercent / 100) - (Max Health(Event Player)
			- Health(Event Player))) * (Global.WorkShop_settings_arr[5] / 100), False, True);
		Set Ultimate Charge(Event Player, Ultimate Charge Percent(Event Player) + 25);
	}
}

rule("respawn withoup ult")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Global.WorkShop_settings_arr[7] == True;
		Is Dead(Event Player) == True;
	}

	actions
	{
		disabled Apply Impulse(Event Player, Up, 70, To World, Cancel Contrary Motion);
		Wait(0.250, Ignore Condition);
		Set Ultimate Charge(Event Player, 50);
	}
}

rule("charge buff")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Using Ability 1(Event Player) == True;
	}

	actions
	{
		Wait(0.250, Ignore Condition);
		Event Player.damageDealtPercent = 200;
		Set Damage Dealt(Event Player, 200);
		Set Status(Event Player, Null, Burning, 9999);
		Set Gravity(Event Player, 60);
		Set Move Speed(Event Player, 175);
		Wait Until(Is Dead(Event Player) || !Is Using Ability 1(Event Player), 10);
		Set Gravity(Event Player, 100);
		Set Move Speed(Event Player, 100);
		Clear Status(Event Player, Burning);
		Event Player.damageDealtPercent = 125;
		Set Damage Dealt(Event Player, 125);
	}
}

rule("bounce to center")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		(X Component Of(Position Of(Event Player)) <= -43 || X Component Of(Position Of(Event Player)) >= 45 || Z Component Of(Position Of(
			Event Player)) <= -44 || Z Component Of(Position Of(Event Player)) >= 45) == True;
	}

	actions
	{
		Disable Movement Collision With Environment(Event Player, False);
		While(X Component Of(Position Of(Event Player)) <= -43 || X Component Of(Position Of(Event Player)) >= 45 || Z Component Of(
			Position Of(Event Player)) <= -44 || Z Component Of(Position Of(Event Player)) >= 45);
			Apply Impulse(Event Player, Vector Towards(Position Of(Event Player), Vector(11, 40, 3)), 65, To World,
				Incorporate Contrary Motion);
			Wait(0.250, Ignore Condition);
		End;
		If(Y Component Of(Position Of(Event Player)) < 42);
			Enable Movement Collision With Environment(Event Player);
		End;
	}
}

rule("take boost")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Distance Between(Vector(X Component Of(Position Of(Event Player)), 0, Z Component Of(Position Of(Event Player))), Sorted Array(
			Global.boosters_positions, Distance Between(Vector(X Component Of(Position Of(Event Player)), 0, Z Component Of(Position Of(
			Event Player))), Vector(X Component Of(Current Array Element), 0, Z Component Of(Current Array Element))))[0]) < 3;
	}

	actions
	{
		Play Effect(Event Player, Good Pickup Effect, Color(White), Event Player, 100);
	}
}

rule("Правило 21")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Has Spawned(Event Player) == True;
	}

	actions
	{
		Global.H = Empty Array;
		Global.H = Sorted Array(Global.boosters_positions, Distance Between(Vector(X Component Of(Position Of(Event Player)), 0,
			Z Component Of(Position Of(Event Player))), Vector(X Component Of(Current Array Element), 0, Z Component Of(
			Current Array Element))));
	}
}

rule("Правило 22")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Button Held(Event Player, Button(Interact)) == True;
	}

	actions
	{
		Apply Impulse(Players in View Angle(Event Player, All Teams, 45), Vector Towards(Position Of(Players in View Angle(Event Player,
			All Teams, 45)), Eye Position(Event Player)), 30, To World, Cancel Contrary Motion);
		Wait(3, Ignore Condition);
	}
}