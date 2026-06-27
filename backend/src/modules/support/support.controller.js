const supportService = require('./support.service');
const { success, created, notFound } = require('../../utils/responseHelper');

const supportController = {
  async createTicket(req, res, next) {
    try {
      const ticket = await supportService.createTicket(req.user.id, req.body, req.file);
      return created(res, ticket, 'Support ticket created');
    } catch (err) {
      next(err);
    }
  },

  async getMyTickets(req, res, next) {
    try {
      const tickets = await supportService.getUserTickets(req.user.id);
      return success(res, tickets);
    } catch (err) {
      next(err);
    }
  },

  async getMyTicket(req, res, next) {
    try {
      const ticket = await supportService.getUserTicket(req.user.id, req.params.id);
      if (!ticket) return notFound(res, 'Support ticket not found');
      return success(res, ticket);
    } catch (err) {
      next(err);
    }
  },

  async addMyMessage(req, res, next) {
    try {
      const ticket = await supportService.addUserMessage(req.user.id, req.params.id, req.body, req.file);
      if (!ticket) return notFound(res, 'Support ticket not found');
      return success(res, ticket, 'Support message sent');
    } catch (err) {
      next(err);
    }
  },

  async getAdminTickets(req, res, next) {
    try {
      const tickets = await supportService.getAdminTickets(req.query);
      return success(res, tickets);
    } catch (err) {
      next(err);
    }
  },

  async getAdminTicket(req, res, next) {
    try {
      const ticket = await supportService.getAdminTicket(req.params.id);
      if (!ticket) return notFound(res, 'Support ticket not found');
      return success(res, ticket);
    } catch (err) {
      next(err);
    }
  },

  async respondToTicket(req, res, next) {
    try {
      const ticket = await supportService.respondToTicket(req.params.id, req.user.id, req.body);
      if (!ticket) return notFound(res, 'Support ticket not found');
      return success(res, ticket, 'Support ticket responded');
    } catch (err) {
      next(err);
    }
  },

  async updateTicketStatus(req, res, next) {
    try {
      const ticket = await supportService.updateTicketStatus(req.params.id, req.body.status);
      if (!ticket) return notFound(res, 'Support ticket not found');
      return success(res, ticket, 'Support ticket status updated');
    } catch (err) {
      next(err);
    }
  }
};

module.exports = supportController;
