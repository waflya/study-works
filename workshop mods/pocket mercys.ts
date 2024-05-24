settings
{
	main
	{
		Название режима: "Mercys in a pocket"
		Описание: "https://workshop.codes/u/ImPhaIR"
	}

	lobby
	{
		Возврат в лобби: Отключен
		Голосовой чат матча: Вкл.
		Максимум зрителей: 12
		Максимум игроков команда Команда 1: 3
		Максимум игроков команда Команда 2: 3
		Открыть для игроков в очереди: Да
		Смена полей боя: Отключена
	}

	modes
	{
		Гибридный режим
		{
			enabled maps
			{
			}
		}

		Захват точек
		{
			enabled maps
			{
			}
		}

		Командная схватка
		{
			enabled maps
			{
				Кастильо 0
			}
		}

		Контроль
		{
			enabled maps
			{
			}
		}

		Сопровождение
		{
			enabled maps
			{
			}
		}

		Общие
		{
			Время возрождения: 42%
			Лимит героев: Откл.
			Начало матча в режиме: Вручную
		}
	}

	heroes
	{
		Общие
		{
			Ангел
			{
				Время восстановления: Воскрешение: 45%
				Зарядка суперспособности Валькирия: 150%
				Пассивная зарядка суперспособности Валькирия: 200%
			}

			disabled heroes
			{
				Авентюра
				Иллари
				Кирико
				Королева Стервятников
				Мауга
				Раматтра
				Соджорн
				Ткач Жизни
			}
		}
	}

	workshop
	{
		How much Y will change: -0070 
		Mercy scale: 0370
		Speed angle per sec: 159380
		X position relative to player: 1370
		Y position relative to player: 0700
	}
}

variables
{
	global:
		1: PlayersTeam1
		2: PlayersTeam2
		3: MercysTeam1
		4: MercysTeam2
		5: RotareAngle_notworking
		6: RotareXZ
		7: RotareY
		8: RotareSpeed
		9: RotareRadY
		10: scale
		11: Iter
		12: MercySpawned
		13: UltDuration

	player:
		0: DontTouch
		1: Pocket
		2: IsHoldingRbm
		3: IsHoldingLbm
		4: IsPocketDead
		5: POS
		6: Mercy
		7: angle
		8: IsWaiting
		9: IsFrozen
		10: LastAttacker
		11: admindebug
		12: IsAllreadyExploaded
		13: isPocketTruePocket
		14: MercysUltProz
		15: MaxAmmo
		16: Iterator
}

subroutines
{
	1: admindubug
}

rule("fill arr")
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
		Is Dummy Bot(Event Player) != True;
	}

	actions
	{
		If(Team Of(Event Player) == Team 1);
			disabled If(!Array Contains(Global.PlayersTeam1, Event Player));
			Modify Global Variable(PlayersTeam2, Remove From Array By Value, Event Player);
			Modify Global Variable(PlayersTeam1, Append To Array, Event Player);
			disabled End;
			disabled If(Event Player.Mercy == Null);
			disabled Modify Global Variable(PlayersTeam2, Remove From Array By Value, Event Player.Mercy);
			disabled Create Dummy Bot(Hero(Ангел), Team Of(Event Player), -1, Event Player, Vector(0, 0, 0));
			disabled Modify Global Variable(MercysTeam1, Append To Array, Last Created Entity);
			disabled Event Player.Mercy = Last Created Entity;
			disabled Event Player.Mercy.Pocket = Event Player;
			disabled End;
		Else;
			disabled If(!Array Contains(Global.PlayersTeam2, Event Player));
			Modify Global Variable(PlayersTeam1, Remove From Array By Value, Event Player);
			Modify Global Variable(PlayersTeam2, Append To Array, Event Player);
			disabled End;
			disabled If(Event Player.Mercy == Null);
			disabled Modify Global Variable(MercysTeam1, Remove From Array By Value, Event Player.Mercy);
			disabled Create Dummy Bot(Hero(Ангел), Team Of(Event Player), -1, Event Player, Vector(0, 0, 0));
			disabled Modify Global Variable(MercysTeam2, Append To Array, Last Created Entity);
			disabled Event Player.Mercy = Last Created Entity;
			disabled Event Player.Mercy.Pocket = Event Player;
			disabled End;
		End;
	}
}

rule("global init")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		Global.PlayersTeam1 = Empty Array;
		Global.PlayersTeam2 = Empty Array;
		Global.MercysTeam1 = Empty Array;
		Global.MercysTeam2 = Empty Array;
		Global.RotareAngle_notworking = 5;
		Global.RotareY = Workshop Setting Real(Custom String("Levitation"), Custom String("Y position relative to player"), 0.750, 0, 2,
			0);
		Global.RotareXZ = Workshop Setting Real(Custom String("Levitation"), Custom String("X position relative to player"), 0.500, -5, 5,
			0);
		Global.RotareSpeed = Workshop Setting Real(Custom String("Levitation"), Custom String("Speed (angle per sec)"), 145, 0, 2000, 0);
		Global.RotareRadY = Workshop Setting Real(Custom String("Levitation"), Custom String("How much Y will change"), 0.300, -5, 5, 0);
		Global.scale = Workshop Setting Real(Custom String("Levitation"), Custom String("Mercy scale"), 0.333, 0.100, 3, 0);
		Disable Inspector Recording;
		Global.UltDuration = 10;
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
		Event Player.IsHoldingRbm = False;
		Event Player.IsHoldingLbm = False;
		Event Player.IsPocketDead = False;
		Chase Player Variable At Rate(Event Player, angle, Global.RotareSpeed > 0 ? 180 : -180, Global.RotareSpeed, None);
		Create In-World Text(Filtered Array(All Players(All Teams), Event Player.IsWaiting), Custom String("waiting for pocket"), Vector(
			X Component Of(Eye Position(Event Player)), Y Component Of(Eye Position(Event Player)) + 0.500, Z Component Of(Eye Position(
			Event Player))), 0.750, Clip Against Surfaces, Visible To Position and String, Color(White), Default Visibility);
		disabled Start Scaling Player(Event Player, 0.150 + Event Player.angle / (Event Player.angle > 0 ? 100 : -100), True);
		Create HUD Text(Event Player, Custom String("mercy's ult: {0}%", Event Player.MercysUltProz), Null, Null, Right, 0, Color(White),
			Color(White), Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Filtered Array(Event Player, Event Player.MercysUltProz == 100), Custom String(
			"Mercy can boost you better\r\n            {0} Just Press F {1}", Ability Icon String(Hero(Ангел), Button(Ultimate)),
			Ability Icon String(Hero(Ангел), Button(Ultimate))), Custom String(""), Null, Top, 0, Color(White), Color(White), Color(White),
			Visible To and String, Default Visibility);
	}
}

rule("mercys AI")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Dummy Bot(Event Player) == True;
	}

	actions
	{
		If(Is Dead(Event Player));
			Event Player.isPocketTruePocket = False;
		End;
		If(Event Player.Pocket == Null);
			Stop Forcing Player Position(Event Player);
			Skip If(Event Player.IsWaiting, 4);
			Start Scaling Player(Event Player, 0.360 + Event Player.angle / (Event Player.angle > 0 ? 100 : -100), True);
			Set Status(Event Player, Null, Frozen, 9999);
			Set Status(Event Player, Null, Invincible, 9999);
			Event Player.IsWaiting = True;
			Wait(0.016, Ignore Condition);
			Loop;
		Else;
			Skip If(Is Dead(Event Player.Pocket), 3);
			Clear Status(Event Player, Invincible);
			Event Player.IsWaiting = False;
			Clear Status(Event Player, Frozen);
		End;
		If(Is Dead(Event Player.Pocket));
			Event Player.IsPocketDead = True;
		Else;
			Event Player.IsPocketDead = False;
		End;
		Skip If(Event Player.isPocketTruePocket, 11);
		"check is pocket true pocket"
		While(True);
			If(Ray Cast Hit Player(Eye Position(Event Player), Eye Position(Event Player.Pocket), All Players(Team Of(Event Player)),
				Event Player, True) == Event Player.Pocket);
				Start Holding Button(Event Player, Button(Secondary Fire));
				Start Facing(Event Player, Direction From Angles(Horizontal Facing Angle Of(Event Player.Pocket), 0), 720, To World,
					Direction and Turn Rate);
				Event Player.isPocketTruePocket = True;
				Break;
			End;
			disabled Stop Holding Button(Event Player, Button(Secondary Fire));
			Wait(0.020, Ignore Condition);
			disabled Set Facing(Event Player, Vector Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), To World);
		End;
		"boost or heal"
		If(Health(Event Player.Pocket) != Max Health(Event Player.Pocket));
			Skip If(Event Player.IsHoldingRbm, 2);
			Event Player.IsHoldingRbm = True;
			Start Holding Button(Event Player, Button(Primary Fire));
		Else;
			Skip If(!Event Player.IsHoldingRbm, 2);
			Event Player.IsHoldingRbm = False;
			Stop Holding Button(Event Player, Button(Primary Fire));
			disabled Start Holding Button(Event Player, Button(Secondary Fire));
		End;
		Start Facing(Event Player, Direction Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), 720, To World,
			Direction and Turn Rate);
		"boost or heal"
		disabled If(Health(Event Player.Pocket) != Max Health(Event Player.Pocket));
		disabled If(Event Player.IsHoldingLbm);
		disabled Skip(9);
		disabled End;
		disabled Stop Facing(Event Player);
		disabled Start Facing(Event Player, Direction Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), 720, To World,
			Direction and Turn Rate);
		disabled Stop Holding Button(Event Player, Button(Secondary Fire));
		disabled Event Player.IsHoldingRbm = False;
		disabled Wait(0.020, Ignore Condition);
		disabled Start Holding Button(Event Player, Button(Primary Fire));
		disabled Event Player.IsHoldingLbm = True;
		disabled While(True);
		disabled If(Ray Cast Hit Player(Eye Position(Event Player), Eye Position(Event Player.Pocket), All Players(Team Of(Event Player)),
			Event Player, True) == Event Player.Pocket);
		disabled Break;
		disabled End;
		disabled Stop Holding Button(Event Player, Button(Primary Fire));
		disabled Wait(0.020, Ignore Condition);
		disabled Start Holding Button(Event Player, Button(Primary Fire));
		disabled End;
		disabled Wait(0.100, Ignore Condition);
		disabled Start Facing(Event Player, Facing Direction Of(Event Player.Pocket), 720, To World, Direction and Turn Rate);
		disabled Else;
		disabled If(Event Player.IsHoldingRbm);
		disabled Skip(9);
		disabled End;
		disabled Stop Facing(Event Player);
		disabled Start Facing(Event Player, Direction Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), 720, To World,
			Direction and Turn Rate);
		disabled Stop Holding Button(Event Player, Button(Primary Fire));
		disabled Event Player.IsHoldingLbm = False;
		disabled Wait(0.020, Ignore Condition);
		disabled Start Holding Button(Event Player, Button(Secondary Fire));
		disabled Event Player.IsHoldingRbm = True;
		disabled While(True);
		disabled Set Facing(Event Player, Vector Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), To World);
		disabled Stop Holding Button(Event Player, Button(Secondary Fire));
		disabled Wait(0.020, Ignore Condition);
		disabled Start Holding Button(Event Player, Button(Secondary Fire));
		disabled If(Ray Cast Hit Player(Eye Position(Event Player), Eye Position(Event Player.Pocket), All Players(Team Of(Event Player)),
			Event Player, True) == Event Player.Pocket);
		disabled Break;
		disabled End;
		disabled End;
		disabled Wait(0.100, Ignore Condition);
		disabled Start Facing(Event Player, Facing Direction Of(Event Player.Pocket), 720, To World, Direction and Turn Rate);
		disabled End;
		If(Event Player.IsPocketDead);
			Start Scaling Player(Event Player, 1, True);
			Stop Forcing Player Position(Event Player);
			Stop Facing(Event Player);
			Start Facing(Event Player, Vector Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), 360, To World,
				Direction and Turn Rate);
			Wait(0.200, Ignore Condition);
			Press Button(Event Player, Button(Ability 2));
			Wait(0.020, Ignore Condition);
			If(Is Using Ability 2(Event Player) == False);
				disabled Start Scaling Player(Event Player, 0.100, True);
				disabled Set Status(Event Player, Null, Frozen, 9999);
				disabled Set Status(Event Player, Null, Invincible, 9999);
				disabled If(Event Player.IsFrozen);
				disabled Skip(5);
				disabled End;
				disabled Event Player.IsFrozen = True;
				If(!Event Player.IsAllreadyExploaded);
					Play Effect(All Players(All Teams), Bad Explosion, Color(Orange), Eye Position(Event Player), 3);
					Play Effect(All Players(All Teams), Good Explosion, Color(Red), Eye Position(Event Player), 3);
					Play Effect(All Players(All Teams), Debuff Impact Sound, Color(Orange), Eye Position(Event Player), 100);
					Damage(Filtered Array(Players Within Radius(Position Of(Event Player), 5, Opposite Team Of(Team Of(Event Player)),
						Surfaces And Enemy Barriers), True), Event Player.Pocket, 199);
					Event Player.IsAllreadyExploaded = True;
					Kill(Event Player, Event Player.LastAttacker);
				End;
				Skip(5);
			End;
			Start Throttle In Direction(Event Player, Vector Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), 1,
				To World, Replace existing throttle, Direction and Magnitude);
			Wait(Random Real(0.100, 0.200), Ignore Condition);
			Start Throttle In Direction(Event Player, Vector Towards(Eye Position(Event Player.DontTouch), Eye Position(Event Player)), 1,
				To World, Replace existing throttle, Direction and Magnitude);
			Wait(Random Real(0.200, 0.450), Ignore Condition);
			Start Throttle In Direction(Event Player, Vector Towards(Eye Position(Event Player), Eye Position(Event Player.Pocket)), 1,
				To World, Replace existing throttle, Direction and Magnitude);
		Else;
			Skip If(Event Player.Pocket == Null, 7);
			Skip If(Has Status(Event Player, Stunned), 6);
			Start Facing(Event Player, Direction From Angles(Horizontal Facing Angle Of(Event Player), 0), 720, To World,
				Direction and Turn Rate);
			Event Player.IsFrozen = False;
			disabled Start Forcing Player Position(Event Player, Vector(X Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0),
				Event Player.Pocket, Rotation And Translation)), Y Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0),
				Event Player.Pocket, Rotation And Translation) + Direction From Angles(0, Event Player.Pocket.angle) * Global.RotareRadY),
				Z Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0), Event Player.Pocket, Rotation And Translation))),
				True);
			Start Forcing Player Position(Event Player, Vector(X Component Of(Position Of(Event Player.Pocket) + Direction From Angles(
				Event Player.angle * 1, 0) * Global.RotareXZ), Y Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0),
				Event Player.Pocket, Rotation And Translation) + Direction From Angles(0, Event Player.Pocket.angle) * Global.RotareRadY),
				Z Component Of(Position Of(Event Player.Pocket) + Direction From Angles(Event Player.angle * 1, 0) * Global.RotareXZ)), True);
			Stop Throttle In Direction(Event Player);
			Event Player.IsAllreadyExploaded = False;
			Start Scaling Player(Event Player, Global.scale, True);
		End;
		If(Has Status(Event Player, Stunned));
			Stop Forcing Player Position(Event Player);
			Start Scaling Player(Event Player, 0.850, True);
		End;
		If(Event Player.Pocket == Null);
			Stop Forcing Player Position(Event Player);
		End;
		Event Player.Pocket.MercysUltProz = Ultimate Charge Percent(Event Player);
		Wait(0.016, Ignore Condition);
		Loop;
	}
}

disabled rule("host dubug button")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Event Player == Host Player;
		Is Button Held(Event Player, Button(Interact)) == True;
	}

	actions
	{
		Create Dummy Bot(Hero(Ангел), Team Of(Event Player), -1, Position Of(Event Player), Vector(0, 0, 0));
		Last Created Entity.Pocket = Event Player;
		Wait(3, Ignore Condition);
		Kill(Event Player, Null);
	}
}

disabled rule("rotating")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	actions
	{
		disabled If(Event Player.POS == Null);
		disabled Event Player.POS = Position Of(Event Player);
		disabled End;
		"https://qna.habr.com/q/18976"
		disabled Event Player.POS = Vector(X Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0), Event Player.Pocket,
			Rotation And Translation)), (Y Component Of(Event Player.POS) - Y Component Of(World Vector Of(Vector(Global.RotareXZ,
			Global.RotareY, 0), Event Player.Pocket, Rotation And Translation))) * Sine From Degrees(Global.RotareAngle_notworking) + (
			X Component Of(Event Player.POS) - X Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0), Event Player,
			Rotation And Translation))) * Sine From Degrees(Global.RotareAngle_notworking), Z Component Of(World Vector Of(Vector(
			Global.RotareXZ, Global.RotareY, 0), Event Player.Pocket, Rotation And Translation)));
		Event Player.POS = Vector(X Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0), Event Player.Pocket,
			Rotation And Translation)), Y Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY, 0), Event Player.Pocket,
			Rotation And Translation) + Direction From Angles(0, Event Player.angle) * Global.RotareRadY), Z Component Of(World Vector Of(
			Vector(Global.RotareXZ, Global.RotareY, 0), Event Player.Pocket, Rotation And Translation)));
		Wait(0.100, Ignore Condition);
		Loop;
	}
}

rule("i dont known")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	actions
	{
		If(Event Player.angle == 180);
			Event Player.angle = -179.900;
		End;
		If(Event Player.angle == -180);
			Event Player.angle = 179.900;
		End;
		disabled Global.Iter = 0;
		disabled For Global Variable(Iter, 0, 3, 1);
		disabled Global.PlayersTeam2[Global.Iter].Mercy = Global.MercysTeam2[Global.Iter];
		disabled Global.MercysTeam1[Global.Iter].Pocket = Global.PlayersTeam1[Global.Iter];
		disabled Global.PlayersTeam1[Global.Iter].Mercy = Global.MercysTeam1[Global.Iter];
		disabled Global.MercysTeam2[Global.Iter].Pocket = Global.PlayersTeam2[Global.Iter];
		disabled End;
		Wait(0.016, Ignore Condition);
		Loop;
	}
}

rule("bye random player 3:")
{
	event
	{
		Player Left Match;
		All;
		Все;
	}

	actions
	{
		If(Team Of(Event Player) == Team 1);
			Modify Global Variable(PlayersTeam1, Remove From Array By Value, Event Player);
		Else;
			Modify Global Variable(PlayersTeam2, Remove From Array By Value, Event Player);
		End;
	}
}

rule("dummy setup")
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
		disabled Event Player == Host Player;
		Global.MercySpawned != True;
	}

	actions
	{
		Create Dummy Bot(Hero(Ангел), Team 1, 5, Event Player, Vector(0, 0, 0));
		Modify Global Variable(MercysTeam1, Append To Array, Last Created Entity);
		Create Dummy Bot(Hero(Ангел), Team 1, 4, Event Player, Vector(0, 0, 0));
		Modify Global Variable(MercysTeam1, Append To Array, Last Created Entity);
		Create Dummy Bot(Hero(Ангел), Team 1, 3, Event Player, Vector(0, 0, 0));
		Modify Global Variable(MercysTeam1, Append To Array, Last Created Entity);
		Create Dummy Bot(Hero(Ангел), Team 2, 3, Event Player, Vector(0, 0, 0));
		Modify Global Variable(MercysTeam2, Append To Array, Last Created Entity);
		Create Dummy Bot(Hero(Ангел), Team 2, 4, Event Player, Vector(0, 0, 0));
		Modify Global Variable(MercysTeam2, Append To Array, Last Created Entity);
		Create Dummy Bot(Hero(Ангел), Team 2, 5, Event Player, Vector(0, 0, 0));
		Modify Global Variable(MercysTeam2, Append To Array, Last Created Entity);
		Global.MercySpawned = True;
	}
}

disabled rule("debug HUD")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	actions
	{
		Create HUD Text(Event Player, Custom String("Mercy.pocket -- {0}", Event Player.Mercy.Pocket), Null, Null, Right, 0, Color(Orange),
			Color(White), Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Custom String("Mercy.IsPocketDead -- {0}", Event Player.Mercy.IsPocketDead), Null, Null, Right, 0,
			Color(Orange), Color(White), Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Custom String("Mercy.IsWaiting -- {0}", Event Player.Mercy.IsWaiting), Null, Null, Right, 0, Color(
			Orange), Color(White), Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Custom String("Mercy.Isfrozen -- {0}", Event Player.Mercy.IsFrozen), Null, Null, Right, 0, Color(
			Orange), Color(White), Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Custom String("Mercy -- {0}", Event Player.Mercy), Null, Null, Right, 0, Color(Green), Color(White),
			Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Custom String("angle -- {0}", Event Player.angle), Null, Null, Right, 0, Color(Green), Color(White),
			Color(White), Visible To and String, Default Visibility);
		Create HUD Text(Event Player, Custom String("Mercy.IsPocketTruePocket -- {0}", Event Player.Mercy.isPocketTruePocket), Null, Null,
			Right, 0, Color(Orange), Color(White), Color(White), Visible To and String, Default Visibility);
	}
}

disabled rule("local yeys (not working)")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Dummy Bot(Event Player) != True;
	}

	actions
	{
		disabled If(Team Of(Event Player) == Team 1);
		disabled Event Player.Mercy = Global.MercysTeam1[Index Of Array Value(Global.PlayersTeam1, Event Player)];
		disabled Event Player.Mercy.Pocket = Event Player;
		disabled Else;
		disabled Event Player.Mercy = Global.MercysTeam2[Index Of Array Value(Global.PlayersTeam2, Event Player)];
		disabled Event Player.Mercy.Pocket = Event Player;
		disabled End;
		disabled Wait(0.016, Ignore Condition);
		disabled Loop If Condition Is True;
	}
}

disabled rule("mercy find my pocket (not working)")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	conditions
	{
		Is Dummy Bot(Event Player) == True;
	}

	actions
	{
		If(Event Player.Pocket == Null);
			If(Team Of(Event Player) == Team 1);
				If(Global.PlayersTeam1[2].Mercy == Null);
					Event Player.Pocket = Global.PlayersTeam1[2];
					Event Player.Pocket.Mercy = Event Player;
					Wait(0.016, Ignore Condition);
					Loop If Condition Is True;
				End;
				Wait(Random Real(0.016, 0.050), Ignore Condition);
				If(Global.PlayersTeam1[1].Mercy == Null);
					Event Player.Pocket = Global.PlayersTeam1[1];
					Event Player.Pocket.Mercy = Event Player;
					Wait(0.016, Ignore Condition);
					Loop If Condition Is True;
				End;
				Wait(Random Real(0.016, 0.050), Ignore Condition);
				If(Global.PlayersTeam1[0].Mercy == Null);
					Event Player.Pocket = Global.PlayersTeam1[0];
					Event Player.Pocket.Mercy = Event Player;
					Wait(0.016, Ignore Condition);
					Loop If Condition Is True;
				End;
			Else;
				If(Global.PlayersTeam2[2].Mercy == Null);
					Event Player.Pocket = Global.PlayersTeam2[2];
					Event Player.Pocket.Mercy = Event Player;
					Wait(0.016, Ignore Condition);
					Loop If Condition Is True;
				End;
				Wait(Random Real(0.016, 0.050), Ignore Condition);
				If(Global.PlayersTeam2[1].Mercy == Null);
					Event Player.Pocket = Global.PlayersTeam2[1];
					Event Player.Pocket.Mercy = Event Player;
					Wait(0.016, Ignore Condition);
					Loop If Condition Is True;
				End;
				Wait(Random Real(0.016, 0.050), Ignore Condition);
				If(Global.PlayersTeam2[0].Mercy == Null);
					Event Player.Pocket = Global.PlayersTeam1[0];
					Event Player.Pocket.Mercy = Event Player;
					Wait(0.016, Ignore Condition);
					Loop If Condition Is True;
				End;
			End;
		End;
		Wait(0.016, Ignore Condition);
		Loop If Condition Is True;
	}
}

rule("mercy find my pocket")
{
	event
	{
		Ongoing - Global;
	}

	actions
	{
		Players In Slot(3, Team 1).Pocket = Players In Slot(0, Team 1);
		Players In Slot(0, Team 1).Mercy = Players In Slot(3, Team 1);
		Players In Slot(4, Team 1).Pocket = Players In Slot(1, Team 1);
		Players In Slot(1, Team 1).Mercy = Players In Slot(4, Team 1);
		Players In Slot(5, Team 1).Pocket = Players In Slot(2, Team 1);
		Players In Slot(2, Team 1).Mercy = Players In Slot(5, Team 1);
		Players In Slot(3, Team 2).Pocket = Players In Slot(0, Team 2);
		Players In Slot(0, Team 2).Mercy = Players In Slot(3, Team 2);
		Players In Slot(4, Team 2).Pocket = Players In Slot(1, Team 2);
		Players In Slot(1, Team 2).Mercy = Players In Slot(4, Team 2);
		Players In Slot(5, Team 2).Pocket = Players In Slot(2, Team 2);
		Players In Slot(2, Team 2).Mercy = Players In Slot(5, Team 2);
		Wait(0.050, Ignore Condition);
		Loop;
	}
}

rule("admin debug")
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
		Is Button Held(Event Player, Button(Crouch)) == True;
		Event Player == Host Player;
		Players in View Angle(Filtered Array(Player Closest To Reticle(Event Player, All Teams), !Is Dummy Bot(Event Player)), All Teams,
			30) == True;
	}

	actions
	{
		disabled Set Status(Player Closest To Reticle(Event Player, All Teams), Null, Knocked Down, 5);
		Event Player.admindebug = Player Closest To Reticle(Event Player, All Teams);
		Start Rule(admindubug, Do Nothing);
	}
}

rule("admin debug sub")
{
	event
	{
		Subroutine;
		admindubug;
	}

	actions
	{
		Start Facing(Event Player.admindebug, Facing Direction Of(Event Player), 300, To World, Direction and Turn Rate);
		Wait(5, Ignore Condition);
		Stop Facing(Event Player.admindebug);
	}
}

disabled rule("Правило 16")
{
	event
	{
		Ongoing - Each Player;
		All;
		Все;
	}

	actions
	{
		Start Forcing Player Position(Event Player, Vector(X Component Of(Position Of(Event Player.Pocket) + Direction From Angles(
			Event Player.MercysUltProz * 2, 0) * Global.RotareXZ), Y Component Of(World Vector Of(Vector(Global.RotareXZ, Global.RotareY,
			0), Event Player.Pocket, Rotation And Translation) + Direction From Angles(0, Event Player.Pocket.angle) * Global.RotareRadY),
			Z Component Of(Position Of(Event Player.Pocket) + Direction From Angles(Event Player.angle * 2, 0) * Global.RotareXZ)), True);
	}
}

rule("ult")
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
		Event Player.MercysUltProz == 100;
	}

	actions
	{
		Set Ultimate Charge(Event Player.Mercy, 0);
		disabled Remove All Health Pools From Player(Event Player);
		disabled Remove All Health Pools From Player(Event Player.Mercy);
		Add Health Pool To Player(Event Player.Mercy, Health, 150, False, True);
		disabled Add Health Pool To Player(Event Player.Mercy, Health, 150, False, True);
		disabled Set Slow Motion(80);
		Start Scaling Player(Event Player, 1.300, True);
		Event Player.MaxAmmo = Max Ammo(Event Player, 0);
		Set Max Ammo(Event Player, 0, Event Player.MaxAmmo * 2);
		Press Button(Event Player.Mercy, Button(Ultimate));
		Add Health Pool To Player(Event Player, Armor, Max Health(Event Player) * 1.250, False, True);
		Set Move Speed(Event Player, 200);
		disabled Set Gravity(Event Player, 130);
		disabled Set Ultimate Charge(Event Player, Ultimate Charge Percent(Event Player) + 33);
		Set Damage Dealt(Event Player, 125);
		Set Damage Received(Event Player, 75);
		Set Status(Event Player, Null, Burning, Global.UltDuration);
		disabled Wait(Global.UltDuration, Ignore Condition);
		Event Player.Iterator = 0;
		For Player Variable(Event Player, Iterator, 0, 33, 1);
			Wait(0.330, Ignore Condition);
			Set Ultimate Charge(Event Player, Ultimate Charge Percent(Event Player) + 1);
		End;
		Set Move Speed(Event Player, 100);
		Set Gravity(Event Player, 100);
		Set Damage Dealt(Event Player, 100);
		Set Damage Received(Event Player, 100);
		Set Max Ammo(Event Player, 0, Event Player.MaxAmmo);
		Stop Scaling Player(Event Player);
		Set Slow Motion(100);
		If(Health Of Type(Event Player, Armor) >= 50);
			Remove All Health Pools From Player(Event Player);
			Add Health Pool To Player(Event Player, Armor, 50, False, True);
		End;
		If(Health Of Type(Event Player.Mercy, Health) >= 75);
			Remove All Health Pools From Player(Event Player.Mercy);
			Wait(0.020, Ignore Condition);
			Add Health Pool To Player(Event Player.Mercy, Health, 75, False, True);
		End;
	}
}