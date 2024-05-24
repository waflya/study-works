settings
{
	main
	{
		Название режима: "Arena duels 1v1"
		Описание: "created by ImPhaIR#2248"
	}

	lobby
	{
		Возврат в лобби: Отключен
		Голосовой чат матча: Вкл.
		Открыть для игроков в очереди: Да
	}

	modes
	{
		Схватка
		{
			enabled maps
			{
				Лицзян: командный центр 0
			}
		}

		Общие
		{
			Время возрождения: 10%
			Лимит героев: Откл.
			Начало матча в режиме: Вручную
			Повторы: Откл.
			Случайный герой при возрождении: Вкл.
		}
	}

	heroes
	{
		Общие
		{
			enabled heroes
			{
				Гэндзи
			}
		}
	}
}

variables
{
	global:
		1: Centre
		2: Respawn
		3: CentreRad
		4: QueueList
		5: QueuePos
		6: _i
		7: IsFighting
		8: Fighters
		9: HeroPool
		10: IndexofHeroPool
		11: DrawInaRow
		12: WidowAntistuck

	player:
		1: isInizialized
		2: isWaiting
		3: IsAlive
		4: CurrentHero
}

subroutines
{
	0: enableButtons
	1: disableButtons
	2: abilityReset
	3: arrayReset
}

rule("initialize")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		Global.QueuePos = Vector(-9.170, 282.610, 290.430);
		Global.QueueList = Empty Array;
		Global.Centre = Vector(0, 267, 280);
		Global.Respawn = Array(Vector(-10, 268, 276.200), Vector(10, 268, 276.200));
		Global.CentreRad = 15.100;
		disabled Skip(0);
		Create Effect(All Players(All Teams), Light Shaft, Custom Color(128, 0, 128, 150), Global.Centre, Global.CentreRad,
			Visible To Position and Radius);
		For Global Variable(_i, 0, 9, 1);
			Create In-World Text(Global.QueueList[Evaluate Once(Global._i)] == Null ? Null : Filtered Array(All Players(All Teams),
				Current Array Element.isWaiting || !Global.IsFighting), Custom String("{0} - {1}", Evaluate Once(Global._i) + 1,
				Global.QueueList[Evaluate Once(Global._i)]), Vector(X Component Of(Global.QueuePos), Y Component Of(Global.QueuePos)
				- Evaluate Once(Global._i), Z Component Of(Global.QueuePos)), 1, Do Not Clip, Visible To Position and String, Color(White),
				Default Visibility);
		End;
		Global.IsFighting = False;
		Create In-World Text(Filtered Array(All Players(All Teams), True), Custom String("Queue"), Vector(X Component Of(Global.QueuePos),
			Y Component Of(Global.QueuePos) + 0.750, Z Component Of(Global.QueuePos)), 0.750, Do Not Clip, Visible To Position and String,
			Color(White), Default Visibility);
		Global.HeroPool = Array(Hero(Ана), Hero(Батист), Hero(Гэндзи), Hero(Дзенъятта), Hero(Жнец), Hero(Кулак Смерти), Hero(Лусио), Hero(
			Кэссиди), Hero(Роковая Вдова), Hero(Солдат-76), Hero(Трейсер), Hero(Хандзо), Hero(Эхо), Hero(Эш));
		Global.HeroPool = Randomized Array(Global.HeroPool);
		Global.DrawInaRow = 0;
		Global.HeroPool = Array(Hero(Крысавчик), Hero(Роковая Вдова));
		Global.WidowAntistuck = Workshop Setting Toggle(Custom String("Easter eggs"), Custom String("Widow Anti-Stuck"), True, 0);
	}
}

rule("player init")
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
		Teleport(Event Player, Global.Centre + Vector(0, 6, 0));
		Abort If(Event Player.isInizialized);
		Start Accelerating(Event Player, Direction Towards(Vector(X Component Of(Position Of(Event Player)), Y Component Of(Global.Centre),
			Z Component Of(Position Of(Event Player))), Global.Centre), 3500, Distance Between(Vector(X Component Of(Position Of(
			Event Player)), Y Component Of(Global.Centre), Z Component Of(Position Of(Event Player))), Global.Centre)
			>= Global.CentreRad - 1 ? 100 : 0, To World, Direction Rate and Max Speed);
		Event Player.IsAlive = True;
		Event Player.isInizialized = True;
		Modify Global Variable(QueueList, Append To Array, Event Player);
		Event Player.isWaiting = True;
		Disallow Button(Event Player, Button(Primary Fire));
		Disallow Button(Event Player, Button(Secondary Fire));
		Disallow Button(Event Player, Button(Ability 1));
		Disallow Button(Event Player, Button(Ability 2));
		Disallow Button(Event Player, Button(Ultimate));
		Disallow Button(Event Player, Button(Melee));
		Set Gravity(Event Player, 50);
		Set Move Speed(Event Player, 150);
		Start Forcing Player To Be Hero(Global.Fighters, Global.HeroPool[Global.IndexofHeroPool]);
		Set Status(Event Player, Null, Phased Out, 9999);
	}
}

rule("damage when player abuse zone")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Distance Between(Global.Centre, Vector(X Component Of(Position Of(Event Player)), Y Component Of(Global.Centre), Z Component Of(
			Position Of(Event Player)))) >= Global.CentreRad - -0.500;
	}

	actions
	{
		Wait(0.660, Abort When False);
		Damage(Event Player, Null, Max Health(Event Player) / 2.990);
		Loop If Condition Is True;
	}
}

rule("insta tp when respawn")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Dead(Event Player) == True;
	}

	actions
	{
		Wait Until(Is Alive(Event Player), 30);
		Teleport(Event Player, Global.Centre + Vector(0, 6, 0));
	}
}

rule("Round update")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		If(Global.Fighters[1] != Null && Global.Fighters[0] != Null);
			Skip(6);
		End;
		Wait Until(Total Time Elapsed >= 5, 99999);
		If(Global.Fighters[1] == Null && Global.Fighters[0] != Null);
			Wait Until(Count Of(Global.QueueList) >= 1, 99999);
		Else If(Global.Fighters[0] == Null);
			Wait Until(Count Of(Global.QueueList) >= 2, 99999);
		End;
		"раунд готов к запуску"
		Wait(0.500, Ignore Condition);
		"проверка на первый запуск и заполнение"
		If(Count Of(Global.Fighters) == 1);
			Global.Fighters[1] = Global.QueueList[0];
			Modify Global Variable(QueueList, Remove From Array By Index, 0);
		Else If(Count Of(Global.Fighters) == 0);
			Global.Fighters[0] = Global.QueueList[0];
			Modify Global Variable(QueueList, Remove From Array By Index, 0);
			Wait(0.016, Ignore Condition);
			Global.Fighters[1] = Global.QueueList[0];
			Modify Global Variable(QueueList, Remove From Array By Index, 0);
		End;
		Wait Until(Is Alive(Global.Fighters[0]) && Is Alive(Global.Fighters[1]), 99999);
		Wait(0.150, Ignore Condition);
		"начало раунда: тп + фриз + выключение режима наблюдателя"
		Clear Status(Global.Fighters, Phased Out);
		Set Status(Global.Fighters, Null, Frozen, 1.200);
		Teleport(Global.Fighters[0], Global.Respawn[0]);
		Teleport(Global.Fighters[1], Global.Respawn[1]);
		Set Facing(Global.Fighters[0], Vector Towards(Eye Position(Global.Fighters[0]), Eye Position(Global.Fighters[1])), To World);
		Set Facing(Global.Fighters[1], Vector Towards(Eye Position(Global.Fighters[1]), Eye Position(Global.Fighters[0])), To World);
		Call Subroutine(enableButtons);
		Call Subroutine(abilityReset);
		"ожидание конца раунда"
		Wait Until(Is Dead(Global.Fighters[0]) || Is Dead(Global.Fighters[1]), 99999);
		"возможность ничьи"
		Wait(0.050, Ignore Condition);
		If(Is Dead(Global.Fighters[0]) && Is Dead(Global.Fighters[1]));
			Big Message(All Players(All Teams), Custom String("Draw"));
			Wait(1.250, Ignore Condition);
			"смена перса после второй ничьи"
			If(Global.DrawInaRow >= 1);
				Global.DrawInaRow = 0;
				Global.IndexofHeroPool += 1;
				Start Forcing Player To Be Hero(Global.Fighters, Global.HeroPool[Global.IndexofHeroPool]);
				Loop;
			End;
			Call Subroutine(abilityReset);
			Global.DrawInaRow += 1;
			If(Global.IndexofHeroPool >= Count Of(Global.HeroPool));
				Call Subroutine(arrayReset);
			End;
			Loop;
		End;
		"смена раунда"
		If(Is Dead(Global.Fighters[0]));
			"смена перса чтобы убрать всякие турели"
			Start Forcing Player To Be Hero(Global.Fighters[0], Random Value In Array(Filtered Array(Global.HeroPool, Hero Of(
				Global.Fighters[0]) != Current Array Element)));
			Global.Fighters[0].CurrentHero = Hero Of(Global.Fighters[0]);
			Wait(0.100, Ignore Condition);
			Start Forcing Player To Be Hero(Global.Fighters[0], Global.Fighters[0].CurrentHero);
			Big Message(All Players(All Teams), Custom String("{0} Won", Global.Fighters[1]));
			Play Effect(All Players(All Teams), Ring Explosion, Color(Green), Evaluate Once(Global.Fighters[1]), 3);
			Wait(0.016, Ignore Condition);
			Modify Global Variable(QueueList, Append To Array, Global.Fighters[0]);
			Modify Global Variable(Fighters, Remove From Array By Index, 0);
		Else If(Is Dead(Global.Fighters[1]));
			"смена перса чтобы убрать всякие турели"
			Start Forcing Player To Be Hero(Global.Fighters[1], Random Value In Array(Filtered Array(Все герои,
				Current Array Element != Hero Of(Global.Fighters[1]))));
			Global.Fighters[1].CurrentHero = Hero Of(Global.Fighters[1]);
			Wait(0.100, Ignore Condition);
			Start Forcing Player To Be Hero(Global.Fighters[1], Global.Fighters[1].CurrentHero);
			Big Message(All Players(All Teams), Custom String("{0} Won", Global.Fighters[0]));
			Play Effect(All Players(All Teams), Ring Explosion, Color(Green), Evaluate Once(Global.Fighters[0]), 3);
			Wait(0.016, Ignore Condition);
			Modify Global Variable(QueueList, Append To Array, Global.Fighters[1]);
			Modify Global Variable(Fighters, Remove From Array By Index, 1);
		End;
		Global.DrawInaRow = 0;
		Global.IndexofHeroPool += 1;
		If(Global.IndexofHeroPool >= Count Of(Global.HeroPool));
			Call Subroutine(arrayReset);
		End;
		Wait(0.016, Ignore Condition);
		Call Subroutine(disableButtons);
		Start Forcing Player To Be Hero(Global.Fighters, Global.HeroPool[Global.IndexofHeroPool]);
		End;
		Loop;
	}
}

rule("Sub")
{
	event
	{
		Subroutine;
		enableButtons;
	}

	actions
	{
		Allow Button(Global.Fighters, Button(Primary Fire));
		Allow Button(Global.Fighters, Button(Secondary Fire));
		Allow Button(Global.Fighters, Button(Ability 1));
		Allow Button(Global.Fighters, Button(Ability 2));
		Allow Button(Global.Fighters, Button(Ultimate));
		Allow Button(Global.Fighters, Button(Melee));
		Set Gravity(Global.Fighters, 100);
		Set Move Speed(Global.Fighters, 100);
		Clear Status(Global.Fighters, Phased Out);
		Set Invisible(Global.Fighters, None);
		Set Damage Dealt(Global.Fighters, 100);
	}
}

rule("Sub")
{
	event
	{
		Subroutine;
		disableButtons;
	}

	actions
	{
		Disallow Button(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Button(
			Primary Fire));
		Disallow Button(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Button(
			Secondary Fire));
		Disallow Button(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Button(
			Ability 1));
		Disallow Button(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Button(
			Ability 2));
		Disallow Button(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Button(Ultimate));
		Disallow Button(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Button(Melee));
		Set Gravity(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), 50);
		Set Move Speed(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), 150);
		Set Status(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), Null, Phased Out,
			9999);
		Set Invisible(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), All);
		Set Damage Dealt(Filtered Array(All Players(All Teams), !Array Contains(Global.Fighters, Current Array Element)), 0);
	}
}

rule("Sub")
{
	event
	{
		Subroutine;
		abilityReset;
	}

	actions
	{
		disabled Set Ability Charge(Global.Fighters, Button(Ability 1), 3);
		disabled Set Ability Charge(Global.Fighters, Button(Ability 2), 3);
		disabled Set Ability Cooldown(Global.Fighters, Button(Primary Fire), 0);
		disabled Set Ability Cooldown(Global.Fighters, Button(Secondary Fire), 0);
		disabled Set Ability Cooldown(Global.Fighters, Button(Ability 1), 0);
		disabled Set Ability Cooldown(Global.Fighters, Button(Ability 2), 0);
		disabled Set Ammo(Global.Fighters[0], 0, Max Ammo(Global.Fighters[0], 0));
		disabled Set Ammo(Global.Fighters[0], 1, Max Ammo(Global.Fighters[0], 1));
		disabled Set Ammo(Global.Fighters[1], 0, Max Ammo(Global.Fighters[1], 0));
		disabled Set Ammo(Global.Fighters[1], 1, Max Ammo(Global.Fighters[1], 1));
		disabled Heal(Global.Fighters, Null, 99999);
		Start Forcing Player To Be Hero(Global.Fighters[0], Hero Of(Global.Fighters[0]));
		Start Forcing Player To Be Hero(Global.Fighters[1], Hero Of(Global.Fighters[1]));
	}
}

rule("Sub")
{
	event
	{
		Subroutine;
		arrayReset;
	}

	actions
	{
		Global.IndexofHeroPool = 0;
		Global.HeroPool = Randomized Array(Global.HeroPool);
		Start Forcing Player To Be Hero(All Players(All Teams), Global.HeroPool[Global.IndexofHeroPool]);
	}
}

rule("widow bug")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Hero Of(Event Player) == Hero(Роковая Вдова);
		Is Using Ability 1(Event Player) == True;
		Global.WidowAntistuck == True;
	}

	actions
	{
		Wait(5, Abort When False);
		Small Message(Event Player, Custom String("got it!"));
		Wait(0.500, Ignore Condition);
		Small Message(Event Player, Custom String("press \"Interact\" for stop it >,<", Event Ability));
		Wait Until(!Is Using Ability 1(Event Player) || Is Button Held(Event Player, Button(Interact)), 99999);
		Set Ability 1 Enabled(Event Player, False);
		Wait(0.016, Ignore Condition);
		Set Ability 1 Enabled(Event Player, True);
	}
}

rule("почини свич самопроизвольный свич персов, который я написал чтобы турельки пропадали")
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
		Event Player == Host Player;
	}

	actions
	{
		Kill(Global.Fighters, Null);
	}
}