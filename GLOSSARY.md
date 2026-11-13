# Manuel Maxera Portfolio

A personal portfolio that simulates an Ubuntu desktop, where visitors explore Manuel's background through a simulated Claude Code app and a few simulated Ubuntu apps.

## Desktop

**Desktop**:
The simulated Ubuntu screen shown on large screens, with a top bar, a dock, and app windows.
_Avoid_: Home page, OS

**Top bar**:
The strip across the top of the Desktop that holds the calendar, the CV download, and the social links.
_Avoid_: Navbar, activities bar

**App window**:
A simulated Ubuntu application (Software, Files, Gmail) that shows one kind of portfolio content.
_Avoid_: Dialog, modal

## Portfolio content

**Project**:
Something Manuel built and shows in the portfolio, such as Hoytsx or VBNB.
_Avoid_: Showcase item, work

**Tech skill**:
A technology Manuel works with, such as Python or LangGraph, shown in the Files window and the phone Tech skills card.
_Avoid_: Bare "skill", which means a Command that opens an App window

## Claude Code

**Claude Code**:
The simulated Claude Code app. It opens by default and is the main way visitors move around the portfolio.
_Avoid_: Terminal, Claude desktop

**Claude project**:
A sidebar entry in Claude Code that stands for one portfolio topic (Welcome, About Me, Experience, Projects, Skills, Contact) and contains exactly one Chat.
_Avoid_: Section, tab, bare "project"

**Chat**:
The single scripted conversation inside a Claude project. It opens with instructions and suggested commands.
_Avoid_: Session, conversation

**Command**:
A slash-prefixed input (such as `/show-latest-experience`) that a Chat recognizes and answers with a scripted reply.
_Avoid_: Prompt, query

**Skill**:
A Command whose reply opens an App window, or on phones shows that content inside the Chat.
_Avoid_: Action, launcher
